/**
 * Utility for parsing numbers in Brazilian and international formats
 * Handles quoted values, currency symbols, and percentage signs
 * UPDATED: Enhanced to work with dedicated budget parser
 */

export interface ParsedNumber {
  value: number | null
  isPercentage: boolean
  originalValue: string
}

export class NumberParser {
  private static readonly CURRENCY_PATTERNS = /[R$\$€£¥¢₹₽₩₪]/g
  private static readonly PERCENTAGE_PATTERN = /%$/
  
  // Brazilian format: 1.234,56 or 12,34% or "780,00" or just "780,00"
  private static readonly BRAZILIAN_NUMBER_PATTERN = /^-?[\d.]*,\d{1,4}%?$/
  
  // International format: 1,234.56 or 12.34% or "780.00" or just "780.00" 
  private static readonly INTERNATIONAL_NUMBER_PATTERN = /^-?[\d,]*\.\d{1,4}%?$/
  
  // Simple format: 123 or 45% or 1500 (CRITICAL: includes integer values)
  private static readonly SIMPLE_NUMBER_PATTERN = /^-?\d+%?$/
  
  // Decimal with comma: 780,00 (Brazilian style)
  private static readonly BRAZILIAN_DECIMAL_PATTERN = /^-?\d+,\d{1,4}%?$/
  
  // Decimal with dot: 780.00 (International style)  
  private static readonly INTERNATIONAL_DECIMAL_PATTERN = /^-?\d+\.\d{1,4}%?$/
  
  // Thousand separator patterns (no decimals): 1,500 or 2.000
  private static readonly THOUSAND_ONLY_BRAZILIAN = /^-?\d{1,3}(\.\d{3})+$/  // 2.000 or 15.000
  private static readonly THOUSAND_ONLY_INTERNATIONAL = /^-?\d{1,3}(,\d{3})+$/  // 2,000 or 15,000

  // CRITICAL: Values that should NEVER be converted to numbers
  private static readonly NON_NUMERIC_VALUES = [
    'diário', 'daily', 'diario',
    '--', '-', '—', '–',
    'n/a', 'na', 'null', 'undefined',
    'automático', 'automatic', 'automatico',
    'manual', 'maximize', 'maximizar',
    'target', 'alvo', 'objetivo',
    'enhanced', 'melhorado', 'aprimorado',
    'smart', 'inteligente',
    'portfolio', 'portfólio',
    'pausada', 'ativa', 'ativo', 'paused', 'active', 'enabled', 'disabled'
  ]

  /**
   * CRITICAL: Parses a string value to extract numeric content
   * NEVER converts non-numeric values like "Diário", "--", etc.
   * NOTE: For budget amounts, use BudgetSpecificParser instead
   */
  static parseValue(rawValue: string): ParsedNumber {
    // Remove outer quotes if present
    let cleanValue = rawValue.trim()
    if ((cleanValue.startsWith('"') && cleanValue.endsWith('"')) ||
        (cleanValue.startsWith("'") && cleanValue.endsWith("'"))) {
      cleanValue = cleanValue.slice(1, -1).trim()
    }

    // Check if value is explicitly non-numeric
    if (this.isNonNumericValue(cleanValue)) {
      return { value: null, isPercentage: false, originalValue: rawValue }
    }

    // Handle empty or null-like values
    if (!cleanValue || cleanValue === '') {
      return { value: null, isPercentage: false, originalValue: rawValue }
    }

    // Check if it's a percentage
    const isPercentage = this.PERCENTAGE_PATTERN.test(cleanValue)
    
    // Remove currency symbols and spaces
    let numericValue = cleanValue
      .replace(this.CURRENCY_PATTERNS, '')
      .replace(/\s/g, '')
    
    if (isPercentage) {
      numericValue = numericValue.replace('%', '')
    }

    // Final validation before parsing
    if (this.isNonNumericValue(numericValue)) {
      return { value: null, isPercentage: false, originalValue: rawValue }
    }

    // Parse based on detected format
    const parsedNumber = this.parseNumericString(numericValue)

    return {
      value: parsedNumber,
      isPercentage,
      originalValue: rawValue
    }
  }

  /**
   * CRITICAL: Checks if a value is explicitly non-numeric
   */
  private static isNonNumericValue(value: string): boolean {
    const normalized = value.toLowerCase().trim()
    return this.NON_NUMERIC_VALUES.includes(normalized)
  }

  /**
   * ENHANCED: Parses a numeric string considering Brazilian and international formats
   */
  private static parseNumericString(value: string): number | null {
    // First, ensure it's actually a numeric pattern
    if (!this.isActuallyNumeric(value)) {
      return null
    }

    // Test thousand-only patterns first (no decimals)
    if (this.THOUSAND_ONLY_BRAZILIAN.test(value)) {
      return this.parseBrazilianThousands(value)
    }
    
    if (this.THOUSAND_ONLY_INTERNATIONAL.test(value)) {
      return this.parseInternationalThousands(value)
    }

    // Test Brazilian format (1.234,56 or 780,00)
    if (this.BRAZILIAN_NUMBER_PATTERN.test(value)) {
      return this.parseBrazilianFormat(value)
    }
    
    // Test simple Brazilian decimal (780,00)
    if (this.BRAZILIAN_DECIMAL_PATTERN.test(value)) {
      const normalized = value.replace(',', '.')
      const parsed = parseFloat(normalized)
      return isNaN(parsed) ? null : parsed
    }
    
    // Test international format (1,234.56 or 780.00)
    if (this.INTERNATIONAL_NUMBER_PATTERN.test(value)) {
      return this.parseInternationalFormat(value)
    }
    
    // Test simple international decimal (780.00)
    if (this.INTERNATIONAL_DECIMAL_PATTERN.test(value)) {
      const parsed = parseFloat(value)
      return isNaN(parsed) ? null : parsed
    }
    
    // Test simple format (123 or 780)
    if (this.SIMPLE_NUMBER_PATTERN.test(value)) {
      const parsed = parseFloat(value)
      return isNaN(parsed) ? null : parsed
    }

    // Final fallback: try to parse as-is only if it contains digits
    if (/\d/.test(value)) {
      const fallback = parseFloat(value)
      return isNaN(fallback) ? null : fallback
    }

    return null
  }

  /**
   * CRITICAL: Validates if a string actually contains numeric patterns
   */
  private static isActuallyNumeric(value: string): boolean {
    // Must contain at least one digit
    if (!/\d/.test(value)) {
      return false
    }

    // Must not contain letters (except for currency symbols already removed)
    if (/[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/.test(value)) {
      return false
    }

    return true
  }

  /**
   * ENHANCED: Parses Brazilian format: 1.234,56 or 780,00
   */
  private static parseBrazilianFormat(value: string): number | null {
    if (value.includes('.') && value.includes(',')) {
      // Full format: 1.234,56
      const normalized = value.replace(/\./g, '').replace(',', '.')
      const parsed = parseFloat(normalized)
      return isNaN(parsed) ? null : parsed
    } else if (value.includes(',')) {
      // Decimal only: 780,00
      const normalized = value.replace(',', '.')
      const parsed = parseFloat(normalized)
      return isNaN(parsed) ? null : parsed
    }
    
    return null
  }

  /**
   * ENHANCED: Parses international format: 1,234.56 or 780.00
   */
  private static parseInternationalFormat(value: string): number | null {
    if (value.includes(',') && value.includes('.')) {
      // Full format: 1,234.56
      const normalized = value.replace(/,/g, '')
      const parsed = parseFloat(normalized)
      return isNaN(parsed) ? null : parsed
    } else if (value.includes('.')) {
      // Decimal only: 780.00
      const parsed = parseFloat(value)
      return isNaN(parsed) ? null : parsed
    }
    
    return null
  }

  /**
   * ENHANCED: Parses Brazilian thousands format: 1.500 or 2.000
   */
  private static parseBrazilianThousands(value: string): number | null {
    // Remove dots (thousand separators) and parse
    const normalized = value.replace(/\./g, '')
    const parsed = parseInt(normalized, 10)
    return isNaN(parsed) ? null : parsed
  }

  /**
   * ENHANCED: Parses international thousands format: 1,500 or 2,000
   */
  private static parseInternationalThousands(value: string): number | null {
    // Remove commas (thousand separators) and parse
    const normalized = value.replace(/,/g, '')
    const parsed = parseInt(normalized, 10)
    return isNaN(parsed) ? null : parsed
  }

  /**
   * ENHANCED: Utility to check if a string looks like a number
   */
  static isNumericValue(value: string): boolean {
    if (this.isNonNumericValue(value)) {
      return false
    }

    const cleanValue = value.replace(this.CURRENCY_PATTERNS, '').replace(/\s/g, '')
    
    if (!this.isActuallyNumeric(cleanValue)) {
      return false
    }
    
    const patterns = [
      this.SIMPLE_NUMBER_PATTERN.test(cleanValue),
      this.BRAZILIAN_DECIMAL_PATTERN.test(cleanValue),
      this.INTERNATIONAL_DECIMAL_PATTERN.test(cleanValue),
      this.BRAZILIAN_NUMBER_PATTERN.test(cleanValue),
      this.INTERNATIONAL_NUMBER_PATTERN.test(cleanValue),
      this.THOUSAND_ONLY_BRAZILIAN.test(cleanValue),
      this.THOUSAND_ONLY_INTERNATIONAL.test(cleanValue)
    ]
    
    return patterns.some(p => p)
  }
}
