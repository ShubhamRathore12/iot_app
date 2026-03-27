import { useThemeTokens } from '@/providers/theme';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  total: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({ 
  currentPage, 
  totalPages, 
  total,
  loading = false,
  onPageChange 
}: PaginationControlsProps) {
  const tokens = useThemeTokens();
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && !loading) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page (with neighbors), and last page
      pages.push(1);
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text 
          style={[
            styles.infoText,
            { color: tokens.colors.textSecondary }
          ]}
        >
          Showing {Math.min((currentPage - 1) * 10 + 1, total)}-
          {Math.min(currentPage * 10, total)} of {total} records
        </Text>
      </View>
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[
            styles.pageButton,
            { 
              backgroundColor: tokens.colors.surface,
              borderColor: tokens.colors.border,
            },
            (currentPage === 1 || loading) && styles.disabledButton
          ]}
          onPress={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          <ChevronLeft 
            size={16} 
            color={
              currentPage === 1 || loading 
                ? tokens.colors.textSecondary 
                : tokens.colors.text
            } 
          />
        </TouchableOpacity>
        
        <View style={styles.pageNumbersContainer}>
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={page}>
              {index > 0 && 
               getPageNumbers()[index - 1] !== page - 1 && 
               page !== 1 && 
               page !== totalPages && (
                <Text 
                  style={[
                    styles.ellipsis,
                    { color: tokens.colors.textSecondary }
                  ]}
                >
                  ...
                </Text>
              )}
              
              <TouchableOpacity
                style={[
                  styles.pageNumber,
                  { 
                    backgroundColor: tokens.colors.surface,
                    borderColor: tokens.colors.border,
                  },
                  currentPage === page && {
                    backgroundColor: tokens.colors.primary,
                    borderColor: tokens.colors.primary,
                  },
                  loading && styles.disabledButton
                ]}
                onPress={() => goToPage(page)}
                disabled={loading}
              >
                <Text 
                  style={[
                    styles.pageNumberText,
                    { color: tokens.colors.text },
                    currentPage === page && { color: '#ffffff' }
                  ]}
                >
                  {page}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
        
        <TouchableOpacity
          style={[
            styles.pageButton,
            { 
              backgroundColor: tokens.colors.surface,
              borderColor: tokens.colors.border,
            },
            (currentPage === totalPages || loading) && styles.disabledButton
          ]}
          onPress={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
        >
          <ChevronRight 
            size={16} 
            color={
              currentPage === totalPages || loading 
                ? tokens.colors.textSecondary 
                : tokens.colors.text
            } 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  infoContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pageButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageNumbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pageNumber: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumberText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ellipsis: {
    fontSize: 16,
    paddingHorizontal: 8,
    fontWeight: '600',
  },
});