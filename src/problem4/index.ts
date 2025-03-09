/*
    Complexity: O(1)
    Space Complexity: O(1)
*/
function sum_to_positive_n_a(n: number): number {
    return (n / 2) * (n + 1);
}

function sum_to_n_a(n: number): number {
    return n < 0 ? -sum_to_positive_n_a(-n) : sum_to_positive_n_a(n);
}

/*--------------------------------------------------------------*/

/*
    Complexity: O(n)
    Space Complexity: O(1)
*/
function sum_to_positive_n_b(n: number): number {
    let sum = 0;

    for (let i = 1; i <= n; i++) {
        sum += i;
    }

    return sum;
}

function sum_to_n_b(n: number): number {
	return n < 0 ? -sum_to_positive_n_b(-n) : sum_to_positive_n_b(n);
}

/*--------------------------------------------------------------*/

/*
    Time Complexity: O(n)
    Space Complexity: O(n) due to the recursive call stack.
    
    Note: This implementation may not handle very large values of n (e.g., n > 7,000) 
    depending on the machine's stack size.
*/
function sum_to_positive_n_c(n: number): number {
    if (n <= 1) return n;

    return n + sum_to_positive_n_c(n - 1);
}

function sum_to_n_c(n: number): number {
	return n < 0 ? -sum_to_positive_n_c(-n) : sum_to_positive_n_c(n);
}

/*--------------------------------------------------------------*/

const n = 5_000;

console.log(`sum_to_n_a of ${n}:`, sum_to_n_a(n))
console.log(`sum_to_n_b of ${n}:`, sum_to_n_b(n))
console.log(`sum_to_n_c of ${n}:`, sum_to_n_c(n))
