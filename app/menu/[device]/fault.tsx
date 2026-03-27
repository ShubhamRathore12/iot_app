import FaultLogsPaginated from '@/components/FaultLogsPaginated';
import { ThemedView } from '@/components/themed-view';
import AnimatedButton from '@/components/ui/animated-button';
import AnimatedCard from '@/components/ui/animated-card';
import AnimatedText from '@/components/ui/animated-text';
import LoadingScreen from '@/components/loading-screen';
import { useAutoData } from '@/hooks/use-auto-data';
import { useI18n } from '@/i18n';
import { useThemeMode, useThemeTokens } from '@/providers/theme';
import {
    getFaultCodesForMachine,
    getMachineType,
    getTagsForMachine,
    isActiveTag,
    resolveMachineName,
} from '@/utils/fault-config';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    AlertCircle,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    History,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Define types
interface FaultCode {
  code: number;
  description: string;
}

interface FaultHistoryItem {
    id: string;
    code: string;
    description: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'ACTIVE' | 'RESOLVED';
    timestamp: string;
}

// View type definitions for navigation
type ViewType = 
  | 'active'        // Active alarms view
  | 'codes'         // Fault codes list view
  | 'viewFaultCode' // Individual fault code details
  | 'history'       // Alarm history timeline
  | 'faultLogs'     // Detailed fault logs paginated
  | 'faultHistory'; // Fault history with paginated logs

// Default theme tokens to use before the hook provides them
const defaultTokens = {
    colors: {
        error: '#ef4444',
        success: '#10b981',
        primary: '#3b82f6',
        textSecondary: '#64748b',
        textPrimary: '#000000',
    },
    elevation: {
        high: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        }
    }
};

export default function FaultScreen() {
    const router = useRouter();
    const { effective } = useThemeMode();
    const { t } = useI18n();
    const insets = useSafeAreaInsets();
    const { device } = useLocalSearchParams<{ device: string }>();

    // Use theme tokens with a fallback
    const themeTokens = useThemeTokens();
    const tokens = themeTokens || defaultTokens;

    // Resolve machine name
    const machineName = resolveMachineName(device || '');
    const { data, isConnected, error, isLoading } = useAutoData(machineName || device || '');
    
    const [currentView, setCurrentView] = useState<ViewType>('active'); // Current view state
    const [selectedFault, setSelectedFault] = useState<FaultCode | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [faultHistory, setFaultHistory] = useState<FaultHistoryItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);
    
    const itemsPerPage = 10;

    // Fetch fault history when needed
    useEffect(() => {
        const fetchFaultHistory = async () => {
            if (currentView === 'history') {
                setLoadingHistory(true);
                setHistoryError(null);
                try {
                    // Use your actual fault history fetching function
                    // Example: const history = await getFaultHistoryForMachine(machineName);
                    // setFaultHistory(history);
                    
                    // For now, showing empty state - replace with actual API call
                    setFaultHistory([]);
                } catch (err) {
                    setHistoryError(err instanceof Error ? err.message : 'Failed to load fault history');
                    console.error('Error fetching fault history:', err);
                } finally {
                    setLoadingHistory(false);
                }
            }
        };

        fetchFaultHistory();
    }, [currentView, machineName]);

    // Show loading screen while data is loading
    if (isLoading && !data) {
        return <LoadingScreen />;
    }

    const machineType = getMachineType(machineName || device || '');
    const faultCodes = getFaultCodesForMachine(machineName || device || '');
    const allTags = getTagsForMachine(machineName || device || '', data?.[0]);
    const createdAt = allTags.find((t: any) => t.tag === 'created_at')?.value || null;
    const activeTags = allTags.filter((tag: any) => tag.tag !== 'created_at' && isActiveTag(tag.value));
    
    const totalPages = Math.ceil(faultHistory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = faultHistory.slice(startIndex, endIndex);

    const handleBack = () => {
        if (currentView === 'viewFaultCode') {
            setCurrentView('codes');
            setSelectedFault(null);
        } else if (currentView === 'history' || currentView === 'faultLogs' || currentView === 'faultHistory') {
            setCurrentView('active');
            setCurrentPage(1);
        } else {
            router.back();
        }
    };

    const handleViewFaultCode = (faultCode: FaultCode) => {
        setSelectedFault(faultCode);
        setCurrentView('viewFaultCode');
    };

    const handleViewHistory = () => {
        setCurrentView('history');
        setCurrentPage(1);
    };

    const handleViewFaultLogs = () => {
        setCurrentView('faultLogs');
    };

    const handleViewFaultHistory = () => {
        setCurrentView('faultHistory');
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'HIGH': return '#ef4444';
            case 'MEDIUM': return '#f59e0b';
            case 'LOW': return '#10b981';
            default: return '#64748b';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'ACTIVE' ? '#ef4444' : '#10b981';
    };

    // Main View - Always show the UI regardless of connection status
    // Active alarms will be shown if data is available, otherwise empty state

    // View Fault Code Details Screen
    if (currentView === 'viewFaultCode' && selectedFault) {
        return (
            <ThemedView style={styles.container}>
                <AnimatedCard animated={true} initialScale={0.95} style={{ 
                    margin: 0, 
                    borderRadius: 0, 
                    borderBottomLeftRadius: 20, 
                    borderBottomRightRadius: 20, 
                    ...styles.elevationHigh 
                }}>
                    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <ChevronLeft size={24} color={effective === 'dark' ? '#ffffff' : '#000000'} />
                        </TouchableOpacity>
                        <View style={styles.headerContent}>
                            <AnimatedText style={styles.headerTitle} type="h2">
                                {t('FAULT CODE DETAILS')}
                            </AnimatedText>
                            <AnimatedText style={styles.headerSubtitle} type="caption">
                                {machineType} - {machineName || device}
                            </AnimatedText>
                        </View>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
                        showsVerticalScrollIndicator={false}
                    >
                        <AnimatedCard animated={true} initialScale={0.95} style={{ margin: 0, marginBottom: 16 }}>
                            <View style={styles.faultCodeDetail}>
                                <View style={styles.faultCodeHeader}>
                                    <View style={styles.codeValueContainerLarge}>
                                        <AnimatedText style={styles.codeValueLarge} type="h1">
                                            {selectedFault.code}
                                        </AnimatedText>
                                    </View>
                                    <View style={styles.faultTitleContainer}>
                                        <AnimatedText style={styles.faultDescription} type="h3">
                                            {selectedFault.description}
                                        </AnimatedText>
                                    </View>
                                </View>

                                <View style={styles.infoSection}>
                                    <AnimatedText style={styles.sectionTitle} type="h3">
                                        {t('Fault Information')}
                                    </AnimatedText>
                                    <View style={styles.infoGrid}>
                                        <View style={styles.infoItem}>
                                            <AnimatedText style={styles.infoLabel} type="caption">
                                                {t('Fault Code')}:
                                            </AnimatedText>
                                            <AnimatedText style={styles.infoValue} type="body">
                                                {selectedFault.code}
                                            </AnimatedText>
                                        </View>
                                        <View style={styles.infoItem}>
                                            <AnimatedText style={styles.infoLabel} type="caption">
                                                {t('Machine Model')}:
                                            </AnimatedText>
                                            <AnimatedText style={styles.infoValue} type="body">
                                                {machineType}
                                            </AnimatedText>
                                        </View>
                                        <View style={styles.infoItem}>
                                            <AnimatedText style={styles.infoLabel} type="caption">
                                                {t('Machine Name')}:
                                            </AnimatedText>
                                            <AnimatedText style={styles.infoValue} type="body">
                                                {machineName || device}
                                            </AnimatedText>
                                        </View>
                                        <View style={styles.infoItem}>
                                            <AnimatedText style={styles.infoLabel} type="caption">
                                                {t('Timestamp')}:
                                            </AnimatedText>
                                            <AnimatedText style={styles.infoValue} type="body">
                                                {new Date().toLocaleString()}
                                            </AnimatedText>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.infoSection}>
                                    <AnimatedText style={styles.sectionTitle} type="h3">
                                        {t('Active System Tags')}
                                    </AnimatedText>
                                    {activeTags.length === 0 ? (
                                        <View style={styles.emptyState}>
                                            <AnimatedText style={styles.emptySubtitle} type="caption">
                                                {t('No active tags found')}
                                            </AnimatedText>
                                        </View>
                                    ) : (
                                        activeTags.map((tag: any, index: number) => {
                                            const tagText = typeof tag === 'string' ? tag :
                                                tag && typeof tag === 'object' && 'tag' in tag ?
                                                tag.tag :
                                                String(tag);

                                            return (
                                                <View key={index} style={styles.tagItem}>
                                                    <View style={styles.tagIndicator} />
                                                    <AnimatedText style={styles.tagText} type="body">
                                                        {tagText.replace(/_/g, ' ')}
                                                    </AnimatedText>
                                                </View>
                                            );
                                        })
                                    )}
                                </View>
                            </View>
                        </AnimatedCard>

                        <View style={styles.footer}>
                            <AnimatedButton 
                                title={t('BACK TO FAULT CODES')}
                                onPress={handleBack}
                                variant="secondary"
                                size="medium"
                                style={{ width: '100%' }}
                            />
                        </View>
                    </ScrollView>
                </AnimatedCard>
            </ThemedView>
        );
    }

    // Fault History View - Shows paginated fault logs
    if (currentView === 'faultHistory') {
        return (
            <ThemedView style={styles.container}>
                <AnimatedCard animated={true} initialScale={0.95} style={{ 
                    margin: 0, 
                    borderRadius: 0, 
                    borderBottomLeftRadius: 20, 
                    borderBottomRightRadius: 20, 
                    ...styles.elevationHigh 
                }}>
                    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>  
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <ChevronLeft size={24} color={effective === 'dark' ? '#ffffff' : '#000000'} />
                        </TouchableOpacity>
                        <View style={styles.headerContent}>
                            <AnimatedText style={styles.headerTitle} type="h2">
                                {t('FAULT HISTORY')}
                            </AnimatedText>
                            <AnimatedText style={styles.headerSubtitle} type="caption">
                                {machineName || device}
                            </AnimatedText>
                        </View>
                        {isConnected && (
                            <View style={[styles.statusBadge, { 
                                backgroundColor: activeTags.length > 0 ? tokens.colors.error : tokens.colors.success 
                            }]}>  
                                <AnimatedText style={styles.statusText} type="caption">
                                    {activeTags.length > 0 ? `${activeTags.length} ${t('ACTIVE')}` : t('ALL CLEAR')}
                                </AnimatedText>
                            </View>
                        )}
                    </View>
                    
                    <View style={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}>  
                        <FaultLogsPaginated machineName={machineName || device || ''} />
                    </View>
                </AnimatedCard>
            </ThemedView>
        );
    }

    // Fault Logs Paginated View
    if (currentView === 'faultLogs') {
        return (
            <ThemedView style={styles.container}>
                <AnimatedCard animated={true} initialScale={0.95} style={{ 
                    margin: 0, 
                    borderRadius: 0, 
                    borderBottomLeftRadius: 20, 
                    borderBottomRightRadius: 20, 
                    ...styles.elevationHigh 
                }}>
                    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>  
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <ChevronLeft size={24} color={effective === 'dark' ? '#ffffff' : '#000000'} />
                        </TouchableOpacity>
                        <View style={styles.headerContent}>
                            <AnimatedText style={styles.headerTitle} type="h2">
                                {t('FAULT LOGS')}
                            </AnimatedText>
                            <AnimatedText style={styles.headerSubtitle} type="caption">
                                {machineName || device}
                            </AnimatedText>
                        </View>
                    </View>
                    
                    <View style={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}>  
                        <FaultLogsPaginated machineName={machineName || device || ''} />
                    </View>
                </AnimatedCard>
            </ThemedView>
        );
    }

    // History View
    if (currentView === 'history') {
        return (
            <ThemedView style={styles.container}>
                <AnimatedCard animated={true} initialScale={0.95} style={{ 
                    margin: 0, 
                    borderRadius: 0, 
                    borderBottomLeftRadius: 20, 
                    borderBottomRightRadius: 20, 
                    ...styles.elevationHigh 
                }}>
                    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <ChevronLeft size={24} color={effective === 'dark' ? '#ffffff' : '#000000'} />
                        </TouchableOpacity>
                        <View style={styles.headerContent}>
                            <AnimatedText style={styles.headerTitle} type="h2">
                                {t('ALARM HISTORY')}
                            </AnimatedText>
                            <AnimatedText style={styles.headerSubtitle} type="caption">
                                {machineName || device}
                            </AnimatedText>
                        </View>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
                        showsVerticalScrollIndicator={false}
                    >
                        {loadingHistory ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#3b82f6" />
                                <AnimatedText style={styles.loadingText} type="body">
                                    {t('Loading fault history...')}
                                </AnimatedText>
                            </View>
                        ) : historyError ? (
                            <View style={styles.errorState}>
                                <AnimatedText style={styles.errorTitle} type="h3">
                                    {t('Error Loading History')}
                                </AnimatedText>
                                <AnimatedText style={styles.errorSubtext} type="caption">
                                    {historyError}
                                </AnimatedText>
                            </View>
                        ) : faultHistory.length === 0 ? (
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIconContainer}>
                                    <History size={48} color="#64748b" />
                                </View>
                                <AnimatedText style={styles.emptyTitle} type="h3">
                                    {t('No Fault History')}
                                </AnimatedText>
                                <AnimatedText style={styles.emptySubtitle} type="caption">
                                    {t('No fault records found for this device.')}
                                </AnimatedText>
                            </View>
                        ) : (
                            <>
                                <View style={styles.historyHeader}>
                                    <AnimatedText style={styles.historyTitle} type="h2">
                                        {t('Fault Log Records')}
                                    </AnimatedText>
                                    <AnimatedText style={styles.historyCount} type="caption">
                                        {t('Showing')} {startIndex + 1}-{Math.min(endIndex, faultHistory.length)} {t('of')} {faultHistory.length} {t('records')}
                                    </AnimatedText>
                                </View>
                                
                                {currentItems.map((fault) => (
                                    <AnimatedCard key={fault.id} animated={true} initialScale={0.95} style={{ margin: 0, marginBottom: 12 }}>
                                        <View style={styles.historyItem}>
                                            <View style={styles.historyItemHeader}>
                                                <View style={styles.historyCodeContainer}>
                                                    <AnimatedText style={styles.historyCode} type="body">
                                                        {fault.code}
                                                    </AnimatedText>
                                                </View>
                                                <View style={[
                                                    styles.severityBadge,
                                                    { backgroundColor: `${getSeverityColor(fault.severity)}20` }
                                                ]}>
                                                    <AnimatedText style={[
                                                        styles.severityText,
                                                        { color: getSeverityColor(fault.severity) }
                                                    ]} type="caption">
                                                        {fault.severity}
                                                    </AnimatedText>
                                                </View>
                                                <View style={[
                                                    styles.statusBadgeSmall,
                                                    { backgroundColor: `${getStatusColor(fault.status)}20` }
                                                ]}>
                                                    <AnimatedText style={[
                                                        styles.statusTextSmall,
                                                        { color: getStatusColor(fault.status) }
                                                    ]} type="caption">
                                                        {fault.status}
                                                    </AnimatedText>
                                                </View>
                                            </View>
                                            
                                            <AnimatedText style={styles.historyDescription} type="body">
                                                {fault.description}
                                            </AnimatedText>
                                            
                                            <View style={styles.historyFooter}>
                                                <AnimatedText style={styles.timestamp} type="caption">
                                                    {fault.timestamp}
                                                </AnimatedText>
                                            </View>
                                        </View>
                                    </AnimatedCard>
                                ))}

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <View style={styles.paginationContainer}>
                                        <TouchableOpacity
                                            style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                                            onPress={() => goToPage(1)}
                                            disabled={currentPage === 1}
                                        >
                                            <AnimatedText style={{ fontSize: 16, fontWeight: 'bold', color: currentPage === 1 ? '#64748b' : '#3b82f6' }}>
                                                ⏮
                                            </AnimatedText>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                                            onPress={() => goToPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft size={16} color={currentPage === 1 ? '#64748b' : '#3b82f6'} />
                                        </TouchableOpacity>
                                        
                                        <View style={styles.pageNumbers}>
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }
                                                
                                                return (
                                                    <TouchableOpacity
                                                        key={pageNum}
                                                        style={[
                                                            styles.pageNumber,
                                                            currentPage === pageNum && styles.currentPage
                                                        ]}
                                                        onPress={() => goToPage(pageNum)}
                                                    >
                                                        <AnimatedText style={[
                                                            styles.pageNumberText,
                                                            currentPage === pageNum && styles.currentPageText
                                                        ]} type="caption">
                                                            {pageNum}
                                                        </AnimatedText>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                        
                                        <TouchableOpacity
                                            style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                                            onPress={() => goToPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight size={16} color={currentPage === totalPages ? '#64748b' : '#3b82f6'} />
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                                            onPress={() => goToPage(totalPages)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <AnimatedText style={{ fontSize: 16, fontWeight: 'bold', color: currentPage === totalPages ? '#64748b' : '#3b82f6' }}>
                                                ⏭
                                            </AnimatedText>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        )}
                    </ScrollView>
                </AnimatedCard>
            </ThemedView>
        );
    }

    // Main View (Active Alarms or Fault Codes)
    return (
        <ThemedView style={styles.container}>
            <AnimatedCard animated={true} initialScale={0.95} style={{ 
                margin: 0, 
                borderRadius: 0, 
                borderBottomLeftRadius: 20, 
                borderBottomRightRadius: 20, 
                ...styles.elevationHigh 
            }}>
                <View style={[styles.header, { paddingTop: insets.top + 16 }]}>  
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <ChevronLeft size={24} color={effective === 'dark' ? '#ffffff' : '#000000'} />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <AnimatedText style={styles.headerTitle} type="h2">
                            {currentView === 'active' ? t('DIAGNOSTICS') : t('FAULT CODES')}
                        </AnimatedText>
                        <AnimatedText style={styles.headerSubtitle} type="caption">
                            {machineName || device}
                        </AnimatedText>
                    </View>
                    <View style={[styles.statusBadge, { 
                        backgroundColor: isConnected ? 
                            (activeTags.length > 0 ? tokens.colors.error : tokens.colors.success) : 
                            tokens.colors.warning
                    }]}>  
                        <AnimatedText style={styles.statusText} type="caption">
                            {isConnected ? 
                                (activeTags.length > 0 ? `${activeTags.length} ${t('ACTIVE')}` : t('ALL CLEAR')) :
                                t('NOT CONNECTED')
                            }
                        </AnimatedText>
                    </View>
                </View>

                {/* Tab Navigation for Active Alarms / Fault Codes (First Row) */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, currentView === 'active' && styles.activeTab, {
                            backgroundColor: currentView === 'active' ? `${tokens.colors.error}10` : `${tokens.colors.background}`,
                            borderColor: currentView === 'active' ? `${tokens.colors.error}30` : tokens.colors.border
                        }]}
                        onPress={() => setCurrentView('active')}
                    >
                        <AlertTriangle size={18} color={currentView === 'active' ? tokens.colors.error : tokens.colors.textSecondary} />
                        <AnimatedText style={[styles.tabText,
                            { color: currentView === 'active' ? tokens.colors.error : tokens.colors.textSecondary },
                            currentView === 'active' && { color: tokens.colors.error }
                        ]}>
                            {t('Active Alarms')} ({activeTags.length})
                        </AnimatedText>
                    </TouchableOpacity>
                    {faultCodes.length > 0 && (
                        <TouchableOpacity
                            style={[styles.tab, currentView === 'codes' && styles.activeTab, {
                                backgroundColor: currentView === 'codes' ? `${tokens.colors.error}10` : `${tokens.colors.background}`,
                                borderColor: currentView === 'codes' ? `${tokens.colors.error}30` : tokens.colors.border
                            }]}
                            onPress={() => setCurrentView('codes')}
                        >
                            <AlertCircle size={18} color={currentView === 'codes' ? tokens.colors.error : tokens.colors.textSecondary} />
                            <AnimatedText style={[styles.tabText,
                                { color: currentView === 'codes' ? tokens.colors.error : tokens.colors.textSecondary },
                                currentView === 'codes' && { color: tokens.colors.error }
                            ]}>
                                {t('Fault Codes')} ({faultCodes.length})
                            </AnimatedText>
                        </TouchableOpacity>
                    )}
                </View>
                
                {/* Fault History Tab (Second Row) */}
                <View style={styles.tabContainerBottom}>
                    <TouchableOpacity
                        style={[styles.tabFullWidth, (currentView as ViewType) === 'faultHistory' && styles.activeTab, { 
                            backgroundColor: (currentView as ViewType) === 'faultHistory' ? `${tokens.colors.accent}10` : `${tokens.colors.background}`,
                            borderColor: (currentView as ViewType) === 'faultHistory' ? `${tokens.colors.accent}30` : tokens.colors.border
                        }]}
                        onPress={() => setCurrentView('faultHistory')}
                    >
                        <History size={18} color={(currentView as ViewType) === 'faultHistory' ? tokens.colors.accent : tokens.colors.textSecondary} />
                        <AnimatedText style={[styles.tabText, 
                            { color: (currentView as ViewType) === 'faultHistory' ? tokens.colors.accent : tokens.colors.textSecondary },
                            (currentView as ViewType) === 'faultHistory' && { color: tokens.colors.accent }
                        ]}>
                            {t('Fault History')}
                        </AnimatedText>
                    </TouchableOpacity>
                </View>

                {/* Connection Status with Theme Colors */}
                {!isConnected && (
                    <View style={[styles.warningContainer, { 
                        backgroundColor: `${tokens.colors.warning}10`,
                        borderColor: `${tokens.colors.warning}30`
                    }]}>  
                        <AnimatedText style={[styles.warningText, { color: tokens.colors.warning }]} type="caption">
                            {t('Warning: Not connected to machine data')}
                        </AnimatedText>
                    </View>
                )}
                {error && (
                    <View style={[styles.errorContainer, { 
                        backgroundColor: `${tokens.colors.error}10`,
                        borderColor: `${tokens.colors.error}30`
                    }]}>  
                        <AnimatedText style={[styles.errorText, { color: tokens.colors.error }]} type="caption">
                            {t('Error:')} {error}
                        </AnimatedText>
                    </View>
                )}

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
                    showsVerticalScrollIndicator={false}
                >
                    {currentView === 'active' ? (
                        <View>
                            {activeTags.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <View style={[styles.emptyIconContainer, { backgroundColor: `${tokens.colors.success}10` }]}>  
                                        <AlertCircle size={48} color={tokens.colors.success} />
                                    </View>
                                    <AnimatedText style={[styles.emptyTitle, { color: tokens.colors.text }]} type="h3">
                                        {t('No Active Alarms')}
                                    </AnimatedText>
                                    <AnimatedText style={[styles.emptySubtitle, { color: tokens.colors.textSecondary }]} type="caption">
                                        {t('The system is running within normal parameters.')}
                                    </AnimatedText>
                                </View>
                            ) : (
                                <>
                                    <View style={styles.sectionHeader}>
                                        <AnimatedText style={[styles.sectionTitle, { color: tokens.colors.text }]} type="h3">
                                            {t('Active Tags')} ({activeTags.length})
                                        </AnimatedText>
                                        <AnimatedText style={[styles.sectionSubtitle, { color: tokens.colors.textSecondary }]} type="caption">
                                            {t('Showing currently active fault conditions')}
                                        </AnimatedText>
                                    </View>
                                    
                                    {activeTags.map((tag: any, index: number) => {
                                        const tagText = typeof tag === 'string' ? tag :
                                            tag && typeof tag === 'object' && 'tag' in tag ?
                                            tag.tag :
                                            String(tag);

                                        return (
                                            <AnimatedCard key={index} animated={true} initialScale={0.95} style={{ margin: 0, marginBottom: 12 }}>
                                                <View style={[styles.alarmCard, {
                                                    borderColor: `${tokens.colors.error}20`,
                                                    backgroundColor: `${tokens.colors.error}05`
                                                }]}>
                                                    <View style={[styles.alarmIcon, { backgroundColor: `${tokens.colors.error}10` }]}>
                                                        <AlertTriangle size={20} color={tokens.colors.error} />
                                                    </View>
                                                    <View style={styles.alarmInfo}>
                                                        <AnimatedText style={[styles.alarmTag, { color: tokens.colors.text }]} type="body">
                                                            {tagText.replace(/_/g, ' ')}
                                                        </AnimatedText>
                                                        <View style={styles.alarmMeta}>
                                                            <View style={[styles.activeBadge, { backgroundColor: `${tokens.colors.success}15` }]}>
                                                                <AnimatedText style={[styles.activeBadgeText, { color: tokens.colors.success }]} type="caption">
                                                                    {t('Active')}
                                                                </AnimatedText>
                                                            </View>
                                                            <AnimatedText style={[styles.alarmValue, { color: tokens.colors.error }]} type="caption">
                                                                TRUE
                                                            </AnimatedText>
                                                            {createdAt && (
                                                                <AnimatedText style={[styles.alarmTimestamp, { color: tokens.colors.textSecondary }]} type="caption">
                                                                    {createdAt}
                                                                </AnimatedText>
                                                            )}
                                                        </View>
                                                    </View>
                                                </View>
                                            </AnimatedCard>
                                        );
                                    })}
                                </>
                            )}
                        </View>
                    ) : (
                        <View>
                            <View style={styles.sectionHeader}>
                                <AnimatedText style={[styles.sectionTitle, { color: tokens.colors.text }]} type="h3">
                                    {t('Fault Codes')} ({faultCodes.length} {t('total')})
                                </AnimatedText>
                                <AnimatedText style={[styles.sectionSubtitle, { color: tokens.colors.textSecondary }]} type="caption">
                                    {t('Tap on any code to view details')}
                                </AnimatedText>
                            </View>
                            
                            {faultCodes.map((fault, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    style={[styles.codeRow, { borderBottomColor: `${tokens.colors.border}` }]}
                                    onPress={() => handleViewFaultCode(fault)}
                                >
                                    <View style={[styles.codeValueContainer, { backgroundColor: `${tokens.colors.background}` }]}>  
                                        <AnimatedText style={[styles.codeValue, { color: tokens.colors.error }]} type="body">
                                            {fault.code}
                                        </AnimatedText>
                                    </View>
                                    <AnimatedText style={[styles.codeDescription, { color: tokens.colors.text }]} type="body">
                                        {fault.description}
                                    </AnimatedText>
                                    <ChevronRight size={16} color={tokens.colors.textSecondary} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Footer Buttons */}
                    <View style={styles.footer}>
                        {currentView === 'active' ? (
                            <>
                                {faultCodes.length > 0 && (
                                    <AnimatedButton
                                        title={t('View Fault Codes')}
                                        onPress={() => setCurrentView('codes')}
                                        variant="secondary"
                                        size="medium"
                                        style={{ width: '100%', marginBottom: 12 }}
                                    />
                                )}
                                <AnimatedButton
                                    title={t('View Fault History')}
                                    onPress={handleViewFaultHistory}
                                    variant="secondary"
                                    size="medium"
                                    style={{ width: '100%', marginBottom: 12 }}
                                />
                                <AnimatedButton
                                    title={t('View Detailed Logs')}
                                    onPress={handleViewFaultLogs}
                                    variant="primary"
                                    size="medium"
                                    style={{ width: '100%' }}
                                />
                            </>
                        ) : currentView === 'codes' ? (
                            <>
                                <AnimatedButton
                                    title={t('View Active Alarms')}
                                    onPress={() => setCurrentView('active')}
                                    variant="secondary"
                                    size="medium"
                                    style={{ width: '100%', marginBottom: 12 }}
                                />
                                <AnimatedButton
                                    title={t('View Fault History')}
                                    onPress={handleViewFaultHistory}
                                    variant="secondary"
                                    size="medium"
                                    style={{ width: '100%', marginBottom: 12 }}
                                />
                                <AnimatedButton
                                    title={t('View Detailed Logs')}
                                    onPress={handleViewFaultLogs}
                                    variant="primary"
                                    size="medium"
                                    style={{ width: '100%' }}
                                />
                            </>
                        ) : (
                            <>
                                <AnimatedButton
                                    title={t('View Active Alarms')}
                                    onPress={() => setCurrentView('active')}
                                    variant="secondary"
                                    size="medium"
                                    style={{ width: '100%', marginBottom: 12 }}
                                />
                                {faultCodes.length > 0 && (
                                    <AnimatedButton
                                        title={t('View Fault Codes')}
                                        onPress={() => setCurrentView('codes')}
                                        variant="secondary"
                                        size="medium"
                                        style={{ width: '100%', marginBottom: 12 }}
                                    />
                                )}
                                />
                                <AnimatedButton 
                                    title={t('View Detailed Logs')}
                                    onPress={handleViewFaultLogs}
                                    variant="primary"
                                    size="medium"
                                    style={{ width: '100%' }}
                                />
                            </>
                        )}
                    </View>
                </ScrollView>
            </AnimatedCard>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    elevationHigh: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        opacity: 0.7,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    headerContent: {
        flex: 1,
    },
    backButton: {
        padding: 8,
        marginRight: 12,
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    headerSubtitle: {
        fontSize: 12,
        opacity: 0.6,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '800',
    },
    tabContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
    },
    activeTab: {
        borderWidth: 1,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    tabContainerBottom: {
        padding: 16,
        paddingTop: 0,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    tabFullWidth: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
    },
    connectionStatus: {
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    connectionText: {
        fontSize: 12,
        fontWeight: '500',
    },
    warningContainer: {
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    warningText: {
        fontSize: 12,
        fontWeight: '500',
    },
    errorContainer: {
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    errorText: {
        fontSize: 12,
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 12,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    errorState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        color: '#ef4444',
    },
    errorSubtext: {
        fontSize: 14,
        color: '#ef4444',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    emptySubtitle: {
        fontSize: 14,
        opacity: 0.5,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    alarmCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 12,
        gap: 16,
    },
    alarmIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    alarmInfo: {
        flex: 1,
    },
    alarmTag: {
        fontSize: 15,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    alarmMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    activeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    activeBadgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    alarmValue: {
        fontSize: 12,
        fontWeight: '700',
    },
    alarmTimestamp: {
        fontSize: 11,
        fontWeight: '500',
    },
    codeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        gap: 16,
    },
    codeValueContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    codeValueContainerLarge: {
        width: 60,
        height: 60,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    codeValue: {
        fontSize: 16,
        fontWeight: '800',
        color: '#ef4444',
    },
    codeValueLarge: {
        fontSize: 24,
        fontWeight: '800',
        color: '#ef4444',
    },
    codeDescription: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        marginTop: 32,
    },
    // History Styles
    historyHeader: {
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    historyTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
        color: '#000000',
    },
    historyCount: {
        fontSize: 14,
        color: '#64748b',
    },
    historyItem: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    historyItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    historyCodeContainer: {
        width: 50,
        height: 30,
        borderRadius: 8,
        backgroundColor: '#ef444410',
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyCode: {
        fontSize: 14,
        fontWeight: '800',
        color: '#ef4444',
    },
    severityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    severityText: {
        fontSize: 12,
        fontWeight: '700',
    },
    statusBadgeSmall: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusTextSmall: {
        fontSize: 12,
        fontWeight: '700',
    },
    historyDescription: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 12,
        lineHeight: 22,
        color: '#000000',
    },
    historyFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timestamp: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    // Pagination Styles
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
        gap: 8,
    },
    pageButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    pageNumbers: {
        flexDirection: 'row',
        gap: 6,
    },
    pageNumber: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.03)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentPage: {
        backgroundColor: '#1e293b',
    },
    pageNumberText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    currentPageText: {
        color: '#ffffff',
    },
    // Fault Code Detail Styles
    faultCodeDetail: {
        padding: 16,
    },
    faultCodeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    faultTitleContainer: {
        flex: 1,
    },
    faultDescription: {
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 24,
        color: '#000000',
    },
    infoSection: {
        marginBottom: 24,
    },
    infoGrid: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    infoLabel: {
        fontSize: 12,
    },
    infoValue: {
        fontWeight: '600',
        color: '#000000',
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    tagIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ef4444',
        marginRight: 12,
    },
    tagText: {
        fontSize: 14,
        fontWeight: '500',
    },
});