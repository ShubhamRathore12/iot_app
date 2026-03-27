import { useThemeTokens } from '@/providers/theme';
import { useEffect, useState } from "react";
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import useDebounce from "../hooks/useDebounce";



import { extractTagDataFromRecords, PAGE_SIZE, PaginationInfo, Stats, TagData } from "../utils/faultLogs";
import DebugDataDisplay from "./faultLogs/DebugDataDisplay";
import LoadingIndicator from "./faultLogs/LoadingIndicator";
import PaginationControls from "./faultLogs/PaginationControls";
import SearchBar from "./faultLogs/SearchBar";
import StatisticsCards from "./faultLogs/StatisticsCards";
import TagDataTable from "./faultLogs/TagDataTable";



interface Props {
  machineName: string;
}

export default function FaultLogsPaginated({ machineName }: Props) {
  const tokens = useThemeTokens();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [refreshing, setRefreshing] = useState(false);

  const [tagData, setTagData] = useState<TagData[]>([]);
  const [allTagData, setAllTagData] = useState<TagData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    total: 0,
    totalPages: 0,
    limit: PAGE_SIZE,
    page: 1,
  });
  const [stats, setStats] = useState<Stats>({
    total: 0,
    activeTags: 0,
    faultTags: 0,
    currentPage: 1,
    totalPages: 0,
  });

  const fetchLogs = async (pageNum: number, search = "") => {
    setLoading(true);
    setError(null);

    try {
      let accumulated: TagData[] = [];
      let collectedRaw: any[] = [];

      // First fetch page 1 to get totalPages
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://grain-backend-1.onrender.com";
      const firstUrl = new URL("/api/getActiveFault", apiUrl);
      firstUrl.searchParams.append("machineName", machineName);
      firstUrl.searchParams.append("page", "1");
      firstUrl.searchParams.append("limit", PAGE_SIZE.toString());
      if (machineName === "GTPL-30-gT-180E-S7-1200") {
        firstUrl.searchParams.append("tableName", "GTPL_114_GT_140E_S7_1200");
      }
      if (search && search.trim()) {
        firstUrl.searchParams.append("search", search.trim());
      }
      
      const firstRes = await fetch(firstUrl.toString());
      if (!firstRes.ok)
        throw new Error(
          `API Error: ${firstRes.status} - ${await firstRes.text()}`
        );
      const firstResult = await firstRes.json();
      const totalPages = Number(firstResult?.totalPages || 1);

      const endIdxNeeded = pageNum * PAGE_SIZE;

      for (let apiPage = 1; apiPage <= totalPages; apiPage++) {
        const url = new URL("/api/getActiveFault", apiUrl);
        url.searchParams.append("machineName", machineName);
        url.searchParams.append("page", apiPage.toString());
        url.searchParams.append("limit", PAGE_SIZE.toString());
        if (machineName === "GTPL-30-gT-180E-S7-1200") {
          url.searchParams.append("tableName", "GTPL_114_GT_140E_S7_1200");
        }
        if (search && search.trim()) {
          url.searchParams.append("search", search.trim());
        }

        const res = await fetch(url.toString());
        if (!res.ok)
          throw new Error(`API Error: ${res.status} - ${await res.text()}`);
        const result = await res.json();

        // Extract data from the paginated API response structure
        const batchRows: any[] = Array.isArray(result?.data) ? result.data : [];
        // Set raw data only on first page to avoid overwriting
        if (apiPage === 1) setRawData(batchRows);

        let batchTags = extractTagDataFromRecords(batchRows, machineName);
        if (search && search.trim()) {
          const q = search.trim().toLowerCase();
          batchTags = batchTags.filter((t: TagData) => t.tag.toLowerCase().includes(q));
        }

        accumulated = accumulated.concat(batchTags);
        collectedRaw = collectedRaw.concat(batchRows);

        if (accumulated.length >= endIdxNeeded) break;
      }

      // Use the total from the API response instead of calculated total
      const totalTrue = firstResult?.total || accumulated.length;
      const totalPagesTrue = firstResult?.totalPages || Math.max(1, Math.ceil(totalTrue / PAGE_SIZE));
      const safePage = Math.min(Math.max(1, pageNum), totalPagesTrue);
      const startIdx = (safePage - 1) * PAGE_SIZE;
      const endIdx = startIdx + PAGE_SIZE;
      const pageSlice = accumulated.slice(startIdx, endIdx);

      setAllTagData(accumulated);
      setTagData(pageSlice);
      setStats({
        total: totalTrue,
        activeTags: pageSlice.length,
        faultTags: totalTrue,
        currentPage: safePage,
        totalPages: totalPagesTrue,
      });
      setPaginationInfo({
        total: totalTrue,
        totalPages: totalPagesTrue,
        limit: PAGE_SIZE,
        page: safePage,
      });
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(`Failed to fetch logs: ${err.message}`);
      setTagData([]);
      setRawData([]);
      setStats({
        total: 0,
        activeTags: 0,
        faultTags: 0,
        currentPage: pageNum,
        totalPages: 1,
      });
      setPaginationInfo({
        total: 0,
        totalPages: 1,
        limit: PAGE_SIZE,
        page: pageNum,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLogs(currentPage, debouncedSearch);
  };

  useEffect(() => {
    fetchLogs(currentPage, debouncedSearch);
    const intervalId = setInterval(
      () => fetchLogs(currentPage, debouncedSearch),
      60 * 1000
    );
    return () => clearInterval(intervalId);
  }, [currentPage, machineName, debouncedSearch]);

  // This effect is not needed since we're handling pagination at the fetch level
  // useEffect(() => {
  //   if (allTagData.length === 0) return;
  //   const totalTrue = allTagData.length;
  //   const totalPagesTrue = Math.max(1, Math.ceil(totalTrue / PAGE_SIZE));
  //   const safePage = Math.min(Math.max(1, currentPage), totalPagesTrue);
  //   const startIdx = (safePage - 1) * PAGE_SIZE;
  //   const endIdx = startIdx + PAGE_SIZE;
  //   const pageSlice = allTagData.slice(startIdx, endIdx);
  //   setTagData(pageSlice);
  //   setStats((prev: Stats) => ({
  //     ...prev,
  //     total: totalTrue,
  //     activeTags: pageSlice.length,
  //     faultTags: totalTrue,
  //     currentPage: safePage,
  //     totalPages: totalPagesTrue,
  //   }));
  //   setPaginationInfo({
  //     total: totalTrue,
  //     totalPages: totalPagesTrue,
  //     limit: PAGE_SIZE,
  //     page: safePage,
  //   });
  // }, [currentPage, allTagData]);



  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: tokens.colors.background }]}>  
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[tokens.colors.accent]}
            tintColor={tokens.colors.accent}
          />
        }
      >
        <View style={styles.content}>
          <StatisticsCards stats={stats} />
          
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            loading={loading}
          />

          {error && (
            <View style={[styles.errorContainer, { 
              backgroundColor: `${tokens.colors.error}10`,
              borderColor: `${tokens.colors.error}30`
            }]}>  
              <Text style={[styles.errorText, { color: tokens.colors.error }]}>{error}</Text>
            </View>
          )}

          <DebugDataDisplay data={rawData} machineName={machineName} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>  
              Tag Data ({tagData.length} found on this page)
            </Text>
            <Text style={[styles.sectionSubtitle, { color: tokens.colors.textSecondary }]}>  
              Filtered by: <Text style={[styles.filterText, { color: tokens.colors.text }]}>{debouncedSearch || "None"}</Text>
            </Text>
          </View>

          {loading ? (
            <LoadingIndicator />
          ) : (
            <>
              <View style={styles.tableContainer}>
                <TagDataTable tagData={tagData} />
              </View>
              {paginationInfo.totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={paginationInfo.totalPages}
                  total={paginationInfo.total}
                  loading={loading}
                  onPageChange={(page: number) => setCurrentPage(page)}
                />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  filterText: {
    fontWeight: "600",
  },
  tableContainer: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
});