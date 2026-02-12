"""
Improved PhonePe Payment History PDF Parser
Based on actual PhonePe statement format analysis
"""

import re
import pdfplumber
from datetime import datetime
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)


class PhonePePDFParser:
    """Parser for PhonePe payment history PDFs"""
    
    def __init__(self):
        # Updated patterns based on actual PhonePe format
        self.transaction_patterns = {
            # Date patterns: "Sept 16, 2025" or "Jun 30, 2025"
            'date': r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{1,2},\s+\d{4})',
            # Time: "04:55 pm" or "01:16 pm"
            'time': r'(\d{1,2}:\d{2}\s*(?:am|pm|AM|PM))',
            # Amount: "₹234" or "₹1,634"
            'amount': r'₹\s*([\d,]+(?:\.\d{2})?)',
            # Transaction ID: "T2509161655081188364760" or "C2509161604221663024951"
            'transaction_id': r'Transaction ID\s+([TC][0-9]+)',
            # UTR: "525973216821"
            'utr': r'UTR No\.\s+(\d+)',
            # Type: CREDIT or DEBIT
            'type': r'\b(CREDIT|DEBIT)\b',
        }
        
        # Enhanced category mapping with more keywords
        self.category_mapping = {
            # Food & Dining
            'zomato': 'Food & Dining',
            'swiggy': 'Food & Dining',
            'sweet': 'Food & Dining',
            'fast food': 'Food & Dining',
            'bakery': 'Food & Dining',
            'restaurant': 'Food & Dining',
            
            # Shopping
            'meesho': 'Shopping',
            'amazon': 'Shopping',
            'flipkart': 'Shopping',
            'myntra': 'Shopping',
            'footwear': 'Shopping',
            'bag shop': 'Shopping',
            
            # Transportation
            'uber': 'Transportation',
            'ola': 'Transportation',
            'rapido': 'Transportation',
            
            # Groceries
            'grocery': 'Groceries',
            'groceries': 'Groceries',
            'dmart': 'Groceries',
            'bigbasket': 'Groceries',
            'zepto': 'Groceries',
            'blinkit': 'Groceries',
            'store': 'Groceries',
            
            # Mobile Recharge
            'mobile recharged': 'Mobile Recharge',
            'airtel': 'Mobile Recharge',
            'jio': 'Mobile Recharge',
            'vodafone': 'Mobile Recharge',
            
            # Healthcare
            'pharmacy': 'Healthcare',
            'chemist': 'Healthcare',
            'medicine': 'Healthcare',
            'hospital': 'Healthcare',
            
            # Utilities
            'electricity': 'Utilities',
            'water': 'Utilities',
            'gas': 'Utilities',
            
            # Entertainment
            'netflix': 'Entertainment',
            'prime': 'Entertainment',
            
            # Refund
            'refund': 'Refund',
            
            # Transfer (Personal)
            'received from': 'Personal Transfer',
            'paid to papa': 'Family',
            'paid to maa': 'Family',
            'didi': 'Family',
        }
    
    def parse_pdf(self, pdf_path: str) -> List[Dict]:
        """
        Parse PhonePe PDF and extract all transactions
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            List of transaction dictionaries
        """
        transactions = []
        
        try:
            # Try pdfplumber first
            logger.info(f"Opening PDF with pdfplumber: {pdf_path}")
            
            with pdfplumber.open(pdf_path) as pdf:
                logger.info(f"PDF opened successfully. Pages: {len(pdf.pages)}")
                
                # Extract all text from PDF
                full_text = ""
                for page_num, page in enumerate(pdf.pages, 1):
                    text = page.extract_text()
                    if text:
                        full_text += text + "\n"
                        logger.debug(f"Page {page_num}: Extracted {len(text)} characters")
                    else:
                        logger.warning(f"Page {page_num}: No text extracted")
                
                logger.info(f"Total text extracted: {len(full_text)} characters")
                
                # If pdfplumber got text, parse it
                if full_text.strip():
                    logger.info("Parsing with pdfplumber text")
                    transactions = self._parse_phonepe_format(full_text)
                else:
                    logger.warning("No text extracted with pdfplumber, trying pypdf")
                    # Try alternative extraction with pypdf
                    full_text = self._extract_text_with_pypdf(pdf_path)
                    if full_text.strip():
                        transactions = self._parse_phonepe_format(full_text)
                    else:
                        logger.error("No text could be extracted from PDF!")
            
            logger.info(f"Total transactions extracted: {len(transactions)}")
            return transactions
            
        except Exception as e:
            logger.error(f"Error parsing PDF: {str(e)}", exc_info=True)
            raise Exception(f"Failed to parse PDF: {str(e)}")
    
    def _extract_text_with_pypdf(self, pdf_path: str) -> str:
        """Alternative text extraction using pypdf"""
        try:
            from pypdf import PdfReader
            
            reader = PdfReader(pdf_path)
            full_text = ""
            
            logger.info(f"Trying pypdf extraction. Pages: {len(reader.pages)}")
            
            for page_num, page in enumerate(reader.pages, 1):
                text = page.extract_text()
                if text:
                    full_text += text + "\n"
                    logger.debug(f"pypdf Page {page_num}: Extracted {len(text)} characters")
            
            logger.info(f"pypdf extracted {len(full_text)} total characters")
            return full_text
            
        except Exception as e:
            logger.error(f"pypdf extraction failed: {str(e)}")
            return ""
    
    def _parse_phonepe_format(self, text: str) -> List[Dict]:
        """
        Parse PhonePe specific format - Handles date+transaction on same line
        """
        transactions = []
        
        logger.info(f"Parsing text of length: {len(text)} characters")
        
        # Split into lines
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        logger.info(f"Total non-empty lines in PDF: {len(lines)}")
        
        i = 0
        transaction_count = 0
        
        while i < len(lines):
            line = lines[i]
            
            # Skip headers and footers
            if any(skip in line for skip in [
                'Transaction Statement',
                'Date Transaction Details',
                'Page',
                'This is a system generated',
                'This is an automatically',
                'Disclaimer',
                'https://',
                'terms-conditions'
            ]):
                i += 1
                continue
            
            # Check if line has date AND transaction (CREDIT/DEBIT)
            date_match = re.search(self.transaction_patterns['date'], line)
            type_match = re.search(self.transaction_patterns['type'], line)
            amount_match = re.search(self.transaction_patterns['amount'], line)
            
            if date_match and type_match and amount_match:
                # This line has everything: date + transaction details
                transaction_count += 1
                
                current_date = date_match.group(1)
                transaction_type = type_match.group(1)
                amount_str = amount_match.group(1).replace(',', '')
                
                try:
                    amount = float(amount_str)
                except ValueError:
                    logger.warning(f"Could not parse amount: {amount_str}")
                    i += 1
                    continue
                
                # Extract description (between date and CREDIT/DEBIT)
                date_end = date_match.end()
                type_start = line.find(transaction_type)
                description = line[date_end:type_start].strip()
                
                # Clean up description
                if description.startswith('Paid to '):
                    description = description[8:]
                elif description.startswith('Received from '):
                    description = description[14:]
                elif description.startswith('Refund from '):
                    description = description[12:]
                elif description.startswith('Mobile recharged '):
                    description = 'Mobile Recharge ' + description[17:]
                elif description.startswith('Payment to '):
                    description = description[11:]
                
                # Look ahead for time, Transaction ID and UTR (next few lines)
                current_time = '00:00 am'
                transaction_id = ""
                utr_number = ""
                
                for j in range(i + 1, min(i + 6, len(lines))):
                    next_line = lines[j]
                    
                    # Stop if we hit another date or transaction
                    if re.search(self.transaction_patterns['date'], next_line):
                        break
                    if 'CREDIT' in next_line or 'DEBIT' in next_line:
                        break
                    
                    # Check for time
                    time_match = re.search(self.transaction_patterns['time'], next_line)
                    if time_match:
                        current_time = time_match.group(1)
                    
                    # Check for Transaction ID
                    txn_id_match = re.search(self.transaction_patterns['transaction_id'], next_line)
                    if txn_id_match:
                        transaction_id = txn_id_match.group(1)
                    
                    # Check for UTR
                    utr_match = re.search(self.transaction_patterns['utr'], next_line)
                    if utr_match:
                        utr_number = utr_match.group(1)
                
                # Create transaction
                transaction = {
                    'date': current_date,
                    'time': current_time,
                    'description': description,
                    'type': transaction_type,
                    'amount': amount,
                    'transaction_id': transaction_id,
                    'utr_number': utr_number,
                }
                
                # Standardize and add
                standardized = self._standardize_transaction(transaction)
                if standardized:
                    transactions.append(standardized)
                    logger.info(f"✓ Transaction {transaction_count}: {description[:40]} - ₹{amount}")
                else:
                    logger.warning(f"✗ Transaction {transaction_count} failed standardization")
            
            i += 1
        
        logger.info(f"Parsing complete. Found {len(transactions)} transactions")
        return transactions
    
    def _standardize_transaction(self, transaction: Dict) -> Optional[Dict]:
        """Standardize transaction format and add metadata"""
        
        try:
            # Parse date and time
            date_str = transaction.get('date', '')
            time_str = transaction.get('time', '00:00 am')
            
            transaction_datetime = self._parse_datetime(date_str, time_str)
            
            # Get amount
            amount = transaction.get('amount', 0)
            
            # Get description
            description = transaction.get('description', 'Unknown')
            
            # Auto-categorize
            category = self._auto_categorize(description, transaction.get('type', 'DEBIT'))
            
            # Build standardized transaction
            standardized = {
                'transaction_date': transaction_datetime.isoformat(),
                'description': description,
                'amount': abs(amount),
                'type': transaction.get('type', 'DEBIT'),
                'category': category,
                'status': 'SUCCESS',  # PhonePe statements only show successful transactions
                'transaction_id': transaction.get('transaction_id', ''),
                'utr_number': transaction.get('utr_number', ''),
            }
            
            return standardized
            
        except Exception as e:
            logger.warning(f"Error standardizing transaction: {str(e)}")
            return None
    
    def _parse_datetime(self, date_str: str, time_str: str = '00:00 am') -> datetime:
        """Parse date and time strings into datetime object"""
        
        try:
            # PhonePe format: "Sept 16, 2025" + "04:55 pm"
            # Normalize month names
            date_str = date_str.replace('Sept', 'Sep')
            
            # Parse date
            date_obj = datetime.strptime(date_str, '%b %d, %Y')
            
            # Parse time
            time_obj = datetime.strptime(time_str.strip(), '%I:%M %p').time()
            
            # Combine
            result = datetime.combine(date_obj.date(), time_obj)
            
            return result
            
        except Exception as e:
            logger.warning(f"Error parsing datetime '{date_str} {time_str}': {str(e)}")
            # Return current datetime as fallback
            return datetime.now()
    
    def _auto_categorize(self, description: str, transaction_type: str) -> str:
        """Auto-categorize transaction based on merchant name"""
        
        description_lower = description.lower()
        
        # Check for refunds first
        if transaction_type == 'CREDIT':
            if 'refund' in description_lower:
                return 'Refund'
            # Check if it's a personal transfer
            for keyword in ['received from', 'maa', 'papa', 'didi', 'kashish', 'mona']:
                if keyword in description_lower:
                    return 'Personal Transfer'
        
        # Check category mapping
        for keyword, category in self.category_mapping.items():
            if keyword in description_lower:
                return category
        
        # Default categories based on common patterns
        if 'bank' in description_lower or 'sbi' in description_lower:
            return 'Banking'
        
        if any(word in description_lower for word in ['sharma', 'singh', 'kumar', 'gupta', 'yadav']):
            return 'Personal Payment'
        
        return 'Others'


# Validation function
def validate_transactions(transactions: List[Dict]) -> List[Dict]:
    """Validate and clean extracted transactions"""
    
    valid_transactions = []
    
    for txn in transactions:
        # Check required fields
        if not txn.get('description') or not txn.get('amount'):
            logger.warning(f"Skipping invalid transaction: {txn}")
            continue
        
        # Ensure amount is positive
        if txn['amount'] < 0:
            txn['amount'] = abs(txn['amount'])
        
        # Ensure type is valid
        if txn.get('type') not in ['CREDIT', 'DEBIT']:
            txn['type'] = 'DEBIT'
        
        valid_transactions.append(txn)
    
    return valid_transactions