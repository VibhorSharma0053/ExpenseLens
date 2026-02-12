"""
Test script for PhonePe PDF Parser
Run this to test the parser with your PhonePe PDF files
"""

from pdf_parser import PhonePePDFParser, validate_transactions
import json
import sys

def test_parser(pdf_path: str):
    """Test the PDF parser with a sample file"""
    
    print(f"\n{'='*60}")
    print(f"Testing PhonePe PDF Parser")
    print(f"{'='*60}\n")
    
    print(f"📄 Processing: {pdf_path}\n")
    
    try:
        # Initialize parser
        parser = PhonePePDFParser()
        
        # Parse PDF
        print("🔍 Extracting transactions...")
        transactions = parser.parse_pdf(pdf_path)
        
        print(f"✅ Extracted {len(transactions)} transactions\n")
        
        # Validate
        print("🔍 Validating transactions...")
        valid_transactions = validate_transactions(transactions)
        
        print(f"✅ Valid transactions: {len(valid_transactions)}")
        print(f"❌ Invalid transactions: {len(transactions) - len(valid_transactions)}\n")
        
        if valid_transactions:
            print(f"{'='*60}")
            print("📊 Sample Transactions (First 5)")
            print(f"{'='*60}\n")
            
            for i, txn in enumerate(valid_transactions[:5], 1):
                print(f"Transaction #{i}:")
                print(f"  Date: {txn['transaction_date']}")
                print(f"  Description: {txn['description']}")
                print(f"  Amount: ₹{txn['amount']}")
                print(f"  Type: {txn['type']}")
                print(f"  Category: {txn['category']}")
                print(f"  Status: {txn['status']}")
                if txn.get('transaction_id'):
                    print(f"  Transaction ID: {txn['transaction_id']}")
                print()
            
            # Category breakdown
            categories = {}
            for txn in valid_transactions:
                cat = txn['category']
                if cat not in categories:
                    categories[cat] = {'count': 0, 'total': 0}
                categories[cat]['count'] += 1
                categories[cat]['total'] += txn['amount']
            
            print(f"{'='*60}")
            print("📈 Category Breakdown")
            print(f"{'='*60}\n")
            
            for cat, data in sorted(categories.items(), key=lambda x: x[1]['total'], reverse=True):
                print(f"{cat:30} | Count: {data['count']:3} | Total: ₹{data['total']:,.2f}")
            
            # Save to JSON for inspection
            output_file = "extracted_transactions.json"
            with open(output_file, 'w') as f:
                json.dump(valid_transactions, f, indent=2, default=str)
            
            print(f"\n✅ Full data saved to: {output_file}")
        
        else:
            print("⚠️  No valid transactions found. Check PDF format.")
        
        print(f"\n{'='*60}")
        print("✅ Test Complete!")
        print(f"{'='*60}\n")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    
    return True


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("\n📝 Usage: python test_parser.py <path_to_phonepe_pdf>\n")
        print("Example: python test_parser.py phonepe_statement.pdf\n")
        sys.exit(1)
    
    pdf_file = sys.argv[1]
    test_parser(pdf_file)
