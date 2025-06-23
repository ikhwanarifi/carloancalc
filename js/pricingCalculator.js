document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculateLoan').addEventListener('click', calculateLoan);
    
    // Calculate on any input change
    document.querySelectorAll('.loan-calculator input, .loan-calculator select').forEach(input => {
        input.addEventListener('change', calculateLoan);
        input.addEventListener('keyup', calculateLoan);
    });
    
    // Initial calculation
    calculateLoan();
    
    function calculateLoan() {
        const price = parseFloat(document.getElementById('vehiclePrice').value) || 0;
        const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
        const loanTerm = parseInt(document.getElementById('loanTerm').value) || 48;
        const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
        
        const principal = price - downPayment;
        const monthlyRate = interestRate / 100 / 12;
        const payments = loanTerm;
        
        // Calculate monthly payment
        const monthlyPayment = principal * 
            (monthlyRate * Math.pow(1 + monthlyRate, payments)) / 
            (Math.pow(1 + monthlyRate, payments) - 1);
        
        const totalPayment = monthlyPayment * payments;
        const totalInterest = totalPayment - principal;
        
        // Update the UI
        document.getElementById('monthlyPayment').textContent = '$' + monthlyPayment.toFixed(2);
        document.getElementById('totalLoan').textContent = '$' + principal.toFixed(2);
        document.getElementById('totalInterest').textContent = '$' + totalInterest.toFixed(2);
        document.getElementById('totalCost').textContent = '$' + (principal + totalInterest).toFixed(2);
    }
});