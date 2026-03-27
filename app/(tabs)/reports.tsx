import LoadingScreen from '@/components/loading-screen';
import { SPRING_CONFIG } from '@/constants/animation-config';
import { useDeviceReports } from '@/hooks/use-device-reports';
import { useThemeTokens } from '@/providers/theme';
import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  Download,
  FileText,
  X,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BASE_URL = 'https://grain-backend-1.onrender.com';

const allDevices = [
  'GTPL-122-gT-1000T-S7-1200', 'GTPL-118-gT-80E-P-S7-200', 'GTPL-108-gT-40E-P-S7-200',
  'GTPL-109-gT-40E-P-S7-200', 'GTPL-110-gT-40E-P-S7-200', 'GTPL-111-gT-80E-P-S7-200',
  'GTPL-112-gT-80E-P-S7-200', 'GTPL-113-gT-80E-P-S7-200', 'GTPL-30-gT-180E-S7-1200',
  'GTPL-115-gT-180E-S7-1200', 'GTPL-116-gT-240E-S7-1200', 'GTPL-117-gT-320E-S7-1200',
  'GTPL-119-gT-180E-S7-1200', 'GTPL-120-gT-180E-S7-1200', 'GTPL-121-gT-1000T-S7-1200',
  'GTPL-124-GT-450T-S7-1200', 'GTPL-133-GT-650T-S7-1200', 'GTPL-132-300-AP-S7-1200',
  'GTPL-134-GT-450T-S7-1200', 'GTPL-135-GT-450T-S7-1200', 'GTPL-137-GT-450T-S7-1200',
  'GTPL-138-GT-450T-S7-1200', 'GTPL-139-GT-300AP-S7-1200', 'GTPL-061-gT-450T-S7-1200',
  'GTPL-145-GT-450T-S7-1200', 'GTPL-148-GT-450T-S7-1200',
];

const DEVICE_TO_TABLE_MAP: Record<string, string> = {
  'GTPL-122-gT-1000T-S7-1200': 'gtpl_122_s7_1200_01',
  'GTPL-108-gT-40E-P-S7-200': 'GTPL_108_gT_40E_P_S7_200_Germany',
  'GTPL-109-gT-40E-P-S7-200': 'GTPL_109_gT_40E_P_S7_200_Germany',
  'GTPL-110-gT-40E-P-S7-200': 'GTPL_110_gT_40E_P_S7_200_Germany',
  'GTPL-111-gT-80E-P-S7-200': 'GTPL_111_gT_80E_P_S7_200_Germany',
  'GTPL-112-gT-80E-P-S7-200': 'GTPL_112_gT_80E_P_S7_200_Germany',
  'GTPL-113-gT-80E-P-S7-200': 'GTPL_113_gT_80E_P_S7_200_Germany',
  'GTPL-30-gT-180E-S7-1200': 'GTPL_114_GT_140E_S7_1200',
  'GTPL-115-gT-180E-S7-1200': 'GTPL_115_GT_180E_S7_1200',
  'GTPL-116-gT-240E-S7-1200': 'GTPL_116_GT_240E_S7_1200',
  'GTPL-117-gT-320E-S7-1200': 'GTPL_117_GT_320E_S7_1200',
  'GTPL-119-gT-180E-S7-1200': 'GTPL_119_GT_180E_S7_1200',
  'GTPL-120-gT-180E-S7-1200': 'GTPL_120_GT_180E_S7_1200',
  'GTPL-121-gT-1000T-S7-1200': 'GTPL_121_GT1000T',
  'GTPL-124-GT-450T-S7-1200': 'GTPL_124_GT_450T_S7_1200',
  'GTPL-133-GT-650T-S7-1200': 'GTPL_131_GT_650T_S7_1200',
  'GTPL-132-300-AP-S7-1200': 'GTPL_132_GT300AP',
  'GTPL-118-gT-80E-P-S7-200': 'kabomachinedatasmart200',
  'GTPL-137-GT-450T-S7-1200': 'GTPL_137_GT_450T_S7_1200',
  'GTPL-138-GT-450T-S7-1200': 'GTPL_138_GT_450T_S7_1200',
  'GTPL-061-gT-450T-S7-1200': 'GTPL_061_GT_450T_S7_1200',
  'GTPL-134-GT-450T-S7-1200': 'GTPL_134_GT_450T_S7_1200',
  'GTPL-135-GT-450T-S7-1200': 'GTPL_135_GT_450T_S7_1200',
  'GTPL-139-GT-300AP-S7-1200': 'GTPL_139_GT300AP',
  'GTPL-145-GT-450T-S7-1200': 'GTPL_145_GT_450T_S7_1200',
  'GTPL-148-GT-450T-S7-1200': 'GTPL_148_GT_450T_S7_1200',
};

const { width } = Dimensions.get('window');

// ─── Animated Button ─────────────────────────────────────────────────
function ActionBtn({
  onPress,
  disabled,
  style,
  children,
}: {
  onPress: () => void;
  disabled?: boolean;
  style?: any;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => { scale.value = withSpring(0.95, SPRING_CONFIG.stiff); }}
      onPressOut={() => { scale.value = withSpring(1, SPRING_CONFIG.default); }}
      style={[style, animStyle, disabled && { opacity: 0.5 }]}
    >
      {children}
    </AnimatedPressable>
  );
}

// ─── Calendar Date Picker ────────────────────────────────────────────
const CalendarDatePicker = ({
  visible,
  onClose,
  onSelect,
  selectedDate,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  selectedDate?: Date;
}) => {
  const tokens = useThemeTokens();
  const [tempSelectedDate, setTempSelectedDate] = useState(
    selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={FadeInDown.springify().damping(18)}
          style={[styles.modalContent, { backgroundColor: tokens.colors.surface, ...(tokens.elevation.high as any) }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: tokens.colors.text }]}>Select Date</Text>
            <Pressable onPress={onClose} style={[styles.modalCloseBtn, { backgroundColor: tokens.colors.background }]}>
              <X size={20} color={tokens.colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.calendarWrapper}>
            <Calendar
              onDayPress={(day: any) => setTempSelectedDate(day.dateString)}
              markedDates={{
                [tempSelectedDate]: { selected: true, selectedColor: tokens.colors.accent },
              }}
              theme={{
                todayTextColor: tokens.colors.accent,
                selectedDayBackgroundColor: tokens.colors.accent,
                selectedDayTextColor: '#fff',
                arrowColor: tokens.colors.accent,
                monthTextColor: tokens.colors.text,
                textSectionTitleColor: tokens.colors.textSecondary,
                textDisabledColor: tokens.colors.textSecondary + '40',
                calendarBackground: 'transparent',
                dayTextColor: tokens.colors.text,
              }}
            />
          </View>

          <View style={styles.modalActions}>
            <ActionBtn
              onPress={onClose}
              style={[styles.modalBtn, { backgroundColor: tokens.colors.background, borderColor: tokens.colors.border, borderWidth: StyleSheet.hairlineWidth }]}
            >
              <Text style={[styles.modalBtnText, { color: tokens.colors.text }]}>Cancel</Text>
            </ActionBtn>
            <ActionBtn
              onPress={() => {
                if (tempSelectedDate) onSelect(new Date(tempSelectedDate));
                onClose();
              }}
              style={[styles.modalBtn, { backgroundColor: tokens.colors.accent }]}
            >
              <Text style={[styles.modalBtnText, { color: '#fff' }]}>Confirm</Text>
            </ActionBtn>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ─── Main Screen ─────────────────────────────────────────────────────
export default function ReportsScreen() {
  const tokens = useThemeTokens();
  const { reports = [], loading, error, fetchReports } = useDeviceReports();

  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    if (allDevices.length > 0 && !selectedDevice) {
      handleDeviceSelect(allDevices[0]);
    }
  }, []);

  const fetchDataWithDateRange = async (tableName: string, start: Date, end: Date) => {
    try {
      setDownloading(true);
      const fromDate = start.toISOString().split('T')[0];
      const toDate = end.toISOString().split('T')[0];
      const url = `${BASE_URL}/api/getAllDataSmart200?table=${encodeURIComponent(tableName)}&fromDate=${fromDate}&toDate=${toDate}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      const arrayData = Array.isArray(result) ? result : [];
      setData(arrayData);
      return arrayData;
    } catch (err: any) {
      Alert.alert('Error', 'Failed to fetch data: ' + err.message);
      return [];
    } finally {
      setDownloading(false);
    }
  };

  const handleDeviceSelect = async (deviceName: string) => {
    setSelectedDevice(deviceName);
    setShowDropdown(false);
    try {
      const tableName = DEVICE_TO_TABLE_MAP[deviceName];
      if (!tableName) { Alert.alert('Error', 'No table mapping found'); return; }
      if (startDate && endDate) {
        await fetchDataWithDateRange(tableName, startDate, endDate);
      } else {
        const response = await fetchReports(tableName);
        setData(Array.isArray(response) ? response : []);
      }
    } catch { Alert.alert('Error', 'Failed to load reports'); }
  };

  const validateDateRange = (): boolean => {
    if (!startDate || !endDate) return true;
    const diffDays = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 3) {
      Alert.alert('Date Range Error', 'Please select a date range of maximum 3 days.');
      return false;
    }
    return true;
  };

  const handleDateFilter = async () => {
    if (!selectedDevice) { Alert.alert('Error', 'Please select a device first'); return; }
    if (!validateDateRange()) return;
    try {
      const tableName = DEVICE_TO_TABLE_MAP[selectedDevice];
      if (!tableName) { Alert.alert('Error', 'No table mapping found'); return; }
      if (startDate && endDate) {
        await fetchDataWithDateRange(tableName, startDate, endDate);
      } else {
        const response = await fetchReports(tableName);
        setData(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch data: ' + (err as Error).message);
    }
  };

  const downloadAllData = async () => {
    if (!startDate || !endDate || !selectedDevice) {
      Alert.alert('Error', 'Please select both date range and device');
      return;
    }
    if (!validateDateRange()) return;
    setDownloading(true);
    setDownloadProgress(0);
    try {
      const tableName = DEVICE_TO_TABLE_MAP[selectedDevice];
      if (!tableName) { Alert.alert('Error', 'No table mapping found'); return; }
      const fromDate = startDate.toISOString().split('T')[0];
      const toDate = endDate.toISOString().split('T')[0];
      const url = `/api/getAllDataSmart200?table=${encodeURIComponent(tableName)}&fromDate=${fromDate}&toDate=${toDate}&downloadAll=true`;
      const response = await fetch(url);
      await response.blob();
      Alert.alert('Download Complete', 'Data has been prepared for download.');
    } catch { Alert.alert('Download Error', 'Failed to download data'); }
    finally { setDownloading(false); setDownloadProgress(0); }
  };

  const renderTable = () => {
    if (loading || downloading) {
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={tokens.colors.accent} />
          <Text style={[styles.centeredText, { color: tokens.colors.textSecondary }]}>Loading reports...</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.centeredContainer}>
          <AlertCircle size={24} color={tokens.colors.error} />
          <Text style={[styles.centeredText, { color: tokens.colors.error }]}>{error}</Text>
        </View>
      );
    }
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <View style={styles.centeredContainer}>
          <FileText size={44} color={tokens.colors.textSecondary + '60'} />
          <Text style={[styles.centeredText, { color: tokens.colors.textSecondary }]}>
            {selectedDevice ? `No data available for ${selectedDevice}` : 'Please select a device'}
          </Text>
        </View>
      );
    }

    const safeData = Array.isArray(data) ? data : [];
    const headers = safeData.length > 0
      ? Object.keys(safeData[0]).filter(h => h !== 'created_at' && !h.startsWith('Spare_'))
      : [];

    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[styles.tableContainer, { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.border }]}
      >
        <View style={styles.tableHeaderContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
            <View style={[styles.tableHeaderRow, { backgroundColor: tokens.colors.accent + '10' }]}>
              {headers.map((header, i) => (
                <View key={i} style={[styles.tableHeaderCell, { width: Math.max(width * 0.3, 150) }]}>
                  <Text style={[styles.tableHeaderText, { color: tokens.colors.accent }]} numberOfLines={2}>{header}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
        <ScrollView horizontal showsVerticalScrollIndicator showsHorizontalScrollIndicator>
          <View>
            {safeData.map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={[styles.tableRow, { backgroundColor: rowIndex % 2 === 0 ? tokens.colors.background : tokens.colors.surface }]}
              >
                {headers.map((header, colIndex) => (
                  <View key={colIndex} style={[styles.tableCell, { width: Math.max(width * 0.3, 150) }]}>
                    <Text style={[styles.tableCellText, { color: tokens.colors.text }]} numberOfLines={2}>
                      {typeof row[header] === 'boolean' ? (row[header] ? 'True' : 'False') : String(row[header] || '')}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  if (!data && loading) return <LoadingScreen />;

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Animated.Text entering={FadeInDown.duration(400)} style={[styles.title, { color: tokens.colors.text }]}>
          Device Reports
        </Animated.Text>

        {/* Device Selection */}
        <Animated.View entering={FadeInDown.delay(80).springify().damping(18)}>
          <Text style={[styles.label, { color: tokens.colors.textSecondary }]}>Select Device</Text>
          <ActionBtn
            onPress={() => setShowDropdown(!showDropdown)}
            style={[styles.selector, { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.border }]}
          >
            <Text
              style={[styles.selectorText, { color: selectedDevice ? tokens.colors.text : tokens.colors.textSecondary }]}
              numberOfLines={1}
            >
              {selectedDevice || 'Choose a device...'}
            </Text>
            <ChevronDown size={18} color={tokens.colors.textSecondary} />
          </ActionBtn>
        </Animated.View>

        {/* Date Range */}
        <Animated.View entering={FadeInDown.delay(160).springify().damping(18)}>
          <Text style={[styles.label, { color: tokens.colors.textSecondary }]}>Date Range</Text>
          <View style={styles.dateRow}>
            <ActionBtn
              onPress={() => setShowStartDatePicker(true)}
              style={[styles.dateBtn, { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.border }]}
            >
              <CalendarDays size={16} color={tokens.colors.accent} />
              <Text style={[styles.dateBtnText, { color: startDate ? tokens.colors.text : tokens.colors.textSecondary }]}>
                {startDate ? startDate.toLocaleDateString() : 'Start Date'}
              </Text>
            </ActionBtn>
            <Text style={[styles.dateSeparator, { color: tokens.colors.textSecondary }]}>to</Text>
            <ActionBtn
              onPress={() => setShowEndDatePicker(true)}
              style={[styles.dateBtn, { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.border }]}
            >
              <CalendarDays size={16} color={tokens.colors.accent} />
              <Text style={[styles.dateBtnText, { color: endDate ? tokens.colors.text : tokens.colors.textSecondary }]}>
                {endDate ? endDate.toLocaleDateString() : 'End Date'}
              </Text>
            </ActionBtn>
          </View>

          {startDate && endDate && (
            <Animated.View
              entering={FadeIn.duration(200)}
              style={[styles.dateInfo, { backgroundColor: tokens.colors.accent + '10' }]}
            >
              <Text style={[styles.dateInfoText, { color: tokens.colors.accent }]}>
                {startDate.toLocaleDateString()} — {endDate.toLocaleDateString()}
                {` (${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days)`}
              </Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(240).springify().damping(18)} style={styles.actionButtons}>
          <ActionBtn
            onPress={handleDateFilter}
            disabled={downloading}
            style={[styles.actionBtn, { backgroundColor: tokens.colors.accent }]}
          >
            {downloading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.actionBtnText}>Apply Filter</Text>
            )}
          </ActionBtn>
          <ActionBtn
            onPress={downloadAllData}
            disabled={!startDate || !endDate || downloading}
            style={[styles.actionBtn, { backgroundColor: tokens.colors.accent }]}
          >
            {downloading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.actionBtnInner}>
                <Download size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Download</Text>
              </View>
            )}
          </ActionBtn>
        </Animated.View>

        {/* Progress */}
        {downloading && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[styles.progressContainer, { backgroundColor: tokens.colors.surface }]}
          >
            <Text style={[styles.progressText, { color: tokens.colors.text }]}>
              Downloading... {downloadProgress}%
            </Text>
            <View style={[styles.progressBar, { backgroundColor: tokens.colors.border }]}>
              <Animated.View style={[styles.progressFill, { width: `${downloadProgress}%`, backgroundColor: tokens.colors.accent }]} />
            </View>
          </Animated.View>
        )}

        {/* Reports Table */}
        {selectedDevice && (
          <Animated.View entering={FadeInDown.delay(320).springify().damping(18)}>
            <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>
              Reports: <Text style={{ color: tokens.colors.accent }}>{selectedDevice}</Text>
            </Text>
            {renderTable()}
          </Animated.View>
        )}
      </ScrollView>

      {/* Device Dropdown Modal */}
      <Modal visible={showDropdown} transparent animationType="fade" onRequestClose={() => setShowDropdown(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowDropdown(false)}>
          <Animated.View
            entering={FadeInDown.springify().damping(18)}
            style={[styles.modalContent, { backgroundColor: tokens.colors.surface, ...(tokens.elevation.high as any) }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: tokens.colors.text }]}>Select Device</Text>
              <Pressable onPress={() => setShowDropdown(false)} style={[styles.modalCloseBtn, { backgroundColor: tokens.colors.background }]}>
                <X size={20} color={tokens.colors.textSecondary} />
              </Pressable>
            </View>
            <ScrollView style={styles.deviceList}>
              {allDevices.map((deviceName, i) => (
                <Animated.View key={deviceName} entering={FadeInDown.delay(i * 30).springify().damping(20)}>
                  <Pressable
                    style={[
                      styles.deviceItem,
                      { borderBottomColor: tokens.colors.border },
                      selectedDevice === deviceName && { backgroundColor: tokens.colors.accent + '10' },
                    ]}
                    onPress={() => handleDeviceSelect(deviceName)}
                  >
                    <Text
                      style={[
                        styles.deviceItemText,
                        { color: selectedDevice === deviceName ? tokens.colors.accent : tokens.colors.text },
                      ]}
                      numberOfLines={1}
                    >
                      {deviceName}
                    </Text>
                  </Pressable>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Date Pickers */}
      <CalendarDatePicker
        visible={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        onSelect={(date) => setStartDate(date)}
        selectedDate={startDate || new Date()}
      />
      <CalendarDatePicker
        visible={showEndDatePicker}
        onClose={() => setShowEndDatePicker(false)}
        onSelect={(date) => setEndDate(date)}
        selectedDate={endDate || new Date()}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 24, letterSpacing: -0.5 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
  selector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth,
  },
  selectorText: { flex: 1, fontSize: 15, marginRight: 8 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth,
  },
  dateBtnText: { fontSize: 13 },
  dateSeparator: { fontSize: 13, fontWeight: '600' },
  dateInfo: { padding: 10, borderRadius: 10, marginTop: 8 },
  dateInfoText: { fontSize: 12, textAlign: 'center', fontWeight: '500' },
  actionButtons: { flexDirection: 'row', gap: 10, marginTop: 20, marginBottom: 20 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 14,
  },
  actionBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  actionBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressContainer: { padding: 14, borderRadius: 14, marginBottom: 16 },
  progressText: { fontSize: 13, marginBottom: 8, textAlign: 'center' },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  centeredContainer: { paddingVertical: 48, alignItems: 'center', gap: 12 },
  centeredText: { fontSize: 14, textAlign: 'center' },
  tableContainer: { borderRadius: 14, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  tableHeaderContainer: { maxHeight: 80 },
  tableHeaderRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8 },
  tableHeaderCell: { paddingHorizontal: 8, justifyContent: 'center' },
  tableHeaderText: { fontSize: 12, fontWeight: '700' },
  tableRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(0,0,0,0.05)' },
  tableCell: { paddingHorizontal: 8, justifyContent: 'center' },
  tableCellText: { fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: width * 0.9, maxHeight: '80%', borderRadius: 20, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalCloseBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  modalActions: { flexDirection: 'row', gap: 10, padding: 16 },
  modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  modalBtnText: { fontSize: 15, fontWeight: '600' },
  calendarWrapper: { paddingHorizontal: 12 },
  deviceList: { maxHeight: 400 },
  deviceItem: { paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  deviceItemText: { fontSize: 14, fontWeight: '500' },
});
