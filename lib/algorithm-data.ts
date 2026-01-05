// Hardcoded algorithm explanations - no API dependency
export interface AlgorithmExplanation {
    name: string
    description: string
    timeComplexity: {
        best: string
        average: string
        worst: string
    }
    spaceComplexity: string
    pseudocode: string
    advantages: string[]
    disadvantages: string[]
    useCases: string[]
    visualizationSteps: string[]
}

export const algorithmExplanations: Record<string, AlgorithmExplanation> = {
    "Bubble Sort": {
        name: "Bubble Sort",
        description: "Bubble Sort is a simple comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until no swaps are needed, indicating that the list is sorted. The algorithm gets its name because smaller elements 'bubble' to the top of the list with each iteration.",
        timeComplexity: {
            best: "O(n) - when array is already sorted",
            average: "O(n²) - quadratic time complexity",
            worst: "O(n²) - when array is reverse sorted"
        },
        spaceComplexity: "O(1) - in-place sorting, only uses a constant amount of extra memory",
        pseudocode: `procedure bubbleSort(A: list of sortable items)
    n = length(A)
    repeat
        swapped = false
        for i = 1 to n-1 inclusive do
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped = true
            end if
        end for
        n = n - 1
    until not swapped
end procedure`,
        advantages: [
            "Simple to understand and implement",
            "No additional memory space required (in-place)",
            "Stable sorting algorithm - preserves relative order of equal elements",
            "Adaptive - efficient for nearly sorted data",
            "Can detect if list is already sorted in O(n) time"
        ],
        disadvantages: [
            "Very slow for large datasets - O(n²) complexity",
            "Not suitable for large lists",
            "Performs poorly compared to other sorting algorithms",
            "Many swap operations can be costly"
        ],
        useCases: [
            "Educational purposes - teaching sorting concepts",
            "Small datasets where simplicity is preferred",
            "Nearly sorted arrays where few swaps are needed",
            "Situations where memory is extremely limited"
        ],
        visualizationSteps: [
            "Start from the first element",
            "Compare adjacent pairs of elements",
            "Swap if left element is greater than right",
            "Move to next pair and repeat",
            "After each pass, largest unsorted element bubbles to end",
            "Repeat until no swaps needed"
        ]
    },

    "Insertion Sort": {
        name: "Insertion Sort",
        description: "Insertion Sort builds the final sorted array one item at a time. It takes each element from the input and finds the location it belongs within the sorted list and inserts it there. It repeats until no input elements remain. This is similar to how you might sort playing cards in your hand.",
        timeComplexity: {
            best: "O(n) - when array is already sorted",
            average: "O(n²) - quadratic time complexity",
            worst: "O(n²) - when array is reverse sorted"
        },
        spaceComplexity: "O(1) - in-place sorting algorithm",
        pseudocode: `procedure insertionSort(A: list of sortable items)
    for i = 1 to length(A) - 1
        key = A[i]
        j = i - 1
        while j >= 0 and A[j] > key
            A[j + 1] = A[j]
            j = j - 1
        end while
        A[j + 1] = key
    end for
end procedure`,
        advantages: [
            "Simple implementation",
            "Efficient for small data sets",
            "Adaptive - efficient for nearly sorted data",
            "Stable sorting algorithm",
            "In-place - requires only O(1) extra memory",
            "Online - can sort as it receives elements"
        ],
        disadvantages: [
            "Inefficient for large lists - O(n²) complexity",
            "Requires many shifts for reverse-sorted data",
            "Not as fast as divide-and-conquer algorithms"
        ],
        useCases: [
            "Small datasets or nearly sorted arrays",
            "Online sorting - when data arrives continuously",
            "As part of more complex algorithms like Timsort",
            "When simplicity is preferred over efficiency"
        ],
        visualizationSteps: [
            "Start with second element (first is considered sorted)",
            "Compare current element with sorted portion",
            "Shift larger elements to the right",
            "Insert current element in correct position",
            "Move to next element and repeat"
        ]
    },

    "Selection Sort": {
        name: "Selection Sort",
        description: "Selection Sort divides the input list into a sorted and unsorted region. It repeatedly selects the smallest (or largest) element from the unsorted portion and moves it to the end of the sorted portion. This process continues until the entire list is sorted.",
        timeComplexity: {
            best: "O(n²) - always scans entire unsorted portion",
            average: "O(n²) - quadratic time complexity",
            worst: "O(n²) - always performs same comparisons"
        },
        spaceComplexity: "O(1) - in-place sorting algorithm",
        pseudocode: `procedure selectionSort(A: list of sortable items)
    n = length(A)
    for i = 0 to n - 1
        minIndex = i
        for j = i + 1 to n
            if A[j] < A[minIndex]
                minIndex = j
            end if
        end for
        swap(A[i], A[minIndex])
    end for
end procedure`,
        advantages: [
            "Simple to understand and implement",
            "In-place sorting - O(1) extra memory",
            "Performs well on small lists",
            "Minimizes number of swaps (at most n swaps)",
            "Good when memory writes are expensive"
        ],
        disadvantages: [
            "O(n²) time complexity in all cases",
            "Not adaptive - doesn't benefit from sorted data",
            "Unstable sorting algorithm",
            "Always performs same number of comparisons"
        ],
        useCases: [
            "Small lists where simplicity is key",
            "When memory writes are more expensive than reads",
            "Educational purposes",
            "When auxiliary memory is limited"
        ],
        visualizationSteps: [
            "Find minimum element in unsorted region",
            "Swap it with first unsorted element",
            "Expand sorted region by one",
            "Repeat until entire array is sorted"
        ]
    },

    "Merge Sort": {
        name: "Merge Sort",
        description: "Merge Sort is an efficient, stable, divide-and-conquer sorting algorithm. It divides the unsorted list into n sublists (each containing one element), then repeatedly merges sublists to produce new sorted sublists until there is only one sublist remaining. This is the sorted list.",
        timeComplexity: {
            best: "O(n log n) - consistent performance",
            average: "O(n log n) - guaranteed efficiency",
            worst: "O(n log n) - always predictable"
        },
        spaceComplexity: "O(n) - requires additional space for merging",
        pseudocode: `procedure mergeSort(A: list of sortable items)
    if length(A) <= 1
        return A
    end if
    
    mid = length(A) / 2
    left = mergeSort(A[0...mid])
    right = mergeSort(A[mid...end])
    
    return merge(left, right)
end procedure

procedure merge(left, right)
    result = []
    while left and right are not empty
        if left[0] <= right[0]
            append left[0] to result
            remove left[0]
        else
            append right[0] to result
            remove right[0]
        end if
    end while
    append remaining elements to result
    return result
end procedure`,
        advantages: [
            "Guaranteed O(n log n) time complexity",
            "Stable sorting algorithm",
            "Predictable performance regardless of input",
            "Excellent for linked lists",
            "Parallelizable - can be distributed across processors",
            "Well-suited for external sorting"
        ],
        disadvantages: [
            "Requires O(n) additional space",
            "Slower than Quick Sort for small arrays",
            "Not in-place (traditional implementation)",
            "Overhead of recursive calls"
        ],
        useCases: [
            "Large datasets requiring guaranteed performance",
            "Linked list sorting",
            "External sorting (files larger than memory)",
            "When stability is required",
            "Parallel and distributed computing"
        ],
        visualizationSteps: [
            "Divide array into two halves",
            "Recursively sort each half",
            "Merge sorted halves together",
            "Compare elements from each half during merge",
            "Place smaller element in result array",
            "Repeat until all elements are merged"
        ]
    },

    "Quick Sort": {
        name: "Quick Sort",
        description: "Quick Sort is a highly efficient, divide-and-conquer sorting algorithm. It selects a 'pivot' element and partitions the other elements into two sub-arrays according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively. It's often faster in practice than other O(n log n) algorithms.",
        timeComplexity: {
            best: "O(n log n) - balanced partitions",
            average: "O(n log n) - expected performance",
            worst: "O(n²) - when pivot is always smallest/largest"
        },
        spaceComplexity: "O(log n) - for recursion stack (in-place partitioning)",
        pseudocode: `procedure quickSort(A, low, high)
    if low < high
        pivotIndex = partition(A, low, high)
        quickSort(A, low, pivotIndex - 1)
        quickSort(A, pivotIndex + 1, high)
    end if
end procedure

procedure partition(A, low, high)
    pivot = A[high]
    i = low - 1
    for j = low to high - 1
        if A[j] < pivot
            i = i + 1
            swap(A[i], A[j])
        end if
    end for
    swap(A[i + 1], A[high])
    return i + 1
end procedure`,
        advantages: [
            "Very fast in practice - often fastest for random data",
            "In-place sorting - O(log n) extra space",
            "Cache-efficient due to good locality",
            "Easy to implement and parallelize",
            "Works well with virtual memory"
        ],
        disadvantages: [
            "O(n²) worst case (can be mitigated)",
            "Unstable sorting algorithm",
            "Not adaptive to input data",
            "Performance depends on pivot selection"
        ],
        useCases: [
            "General-purpose sorting",
            "Large datasets with random distribution",
            "When average performance matters most",
            "Systems with good cache behavior needed",
            "Standard library implementations"
        ],
        visualizationSteps: [
            "Select pivot element (usually last element)",
            "Partition array around pivot",
            "Elements less than pivot go left",
            "Elements greater than pivot go right",
            "Pivot is now in correct position",
            "Recursively sort left and right partitions"
        ]
    },

    "Heap Sort": {
        name: "Heap Sort",
        description: "Heap Sort uses a binary heap data structure to sort elements. It first builds a max-heap from the input data, then repeatedly extracts the maximum element from the heap and rebuilds the heap until all elements are sorted. It combines the benefits of merge sort's O(n log n) complexity with in-place sorting.",
        timeComplexity: {
            best: "O(n log n) - consistent performance",
            average: "O(n log n) - guaranteed efficiency",
            worst: "O(n log n) - always predictable"
        },
        spaceComplexity: "O(1) - in-place sorting algorithm",
        pseudocode: `procedure heapSort(A)
    n = length(A)
    
    // Build max heap
    for i = n/2 - 1 down to 0
        heapify(A, n, i)
    end for
    
    // Extract elements from heap
    for i = n - 1 down to 1
        swap(A[0], A[i])
        heapify(A, i, 0)
    end for
end procedure

procedure heapify(A, n, i)
    largest = i
    left = 2*i + 1
    right = 2*i + 2
    
    if left < n and A[left] > A[largest]
        largest = left
    if right < n and A[right] > A[largest]
        largest = right
    if largest != i
        swap(A[i], A[largest])
        heapify(A, n, largest)
    end if
end procedure`,
        advantages: [
            "Guaranteed O(n log n) time complexity",
            "In-place sorting - O(1) extra space",
            "No worst case like Quick Sort",
            "Good for finding k largest/smallest elements",
            "Useful for priority queue operations"
        ],
        disadvantages: [
            "Not stable sorting algorithm",
            "Poor cache performance due to non-local access",
            "Slower than Quick Sort in practice",
            "Constant factors are larger"
        ],
        useCases: [
            "When guaranteed O(n log n) is needed with O(1) space",
            "Priority queue implementations",
            "Finding k largest elements",
            "External sorting scenarios",
            "Real-time systems requiring predictability"
        ],
        visualizationSteps: [
            "Build max-heap from array",
            "Largest element is at root",
            "Swap root with last element",
            "Reduce heap size by one",
            "Heapify the root to maintain max-heap",
            "Repeat until heap is empty"
        ]
    },

    "Radix Sort": {
        name: "Radix Sort",
        description: "Radix Sort is a non-comparative integer sorting algorithm that sorts data by processing individual digits. It processes digits from least significant to most significant (LSD) or vice versa (MSD). Each digit is sorted using a stable sorting algorithm like Counting Sort.",
        timeComplexity: {
            best: "O(nk) - where k is number of digits",
            average: "O(nk) - linear with respect to input size",
            worst: "O(nk) - consistent performance"
        },
        spaceComplexity: "O(n + k) - requires additional arrays",
        pseudocode: `procedure radixSort(A)
    max = findMax(A)
    exp = 1
    
    while max / exp > 0
        countingSort(A, exp)
        exp = exp * 10
    end while
end procedure

procedure countingSort(A, exp)
    n = length(A)
    output = new array[n]
    count = new array[10] initialized to 0
    
    for i = 0 to n - 1
        digit = (A[i] / exp) % 10
        count[digit]++
    end for
    
    for i = 1 to 9
        count[i] += count[i - 1]
    end for
    
    for i = n - 1 down to 0
        digit = (A[i] / exp) % 10
        output[count[digit] - 1] = A[i]
        count[digit]--
    end for
    
    copy output to A
end procedure`,
        advantages: [
            "Can be faster than comparison sorts for integers",
            "O(nk) - linear time for fixed-length integers",
            "Stable sorting algorithm",
            "Works well for fixed-length strings too",
            "Predictable performance"
        ],
        disadvantages: [
            "Only works for integers or fixed-length strings",
            "Requires O(n + k) extra space",
            "Not efficient for floating-point or variable-length data",
            "Performance depends on number of digits"
        ],
        useCases: [
            "Sorting integers with limited range",
            "Fixed-length string sorting",
            "Phone numbers, postal codes, etc.",
            "When comparison-based sorts are too slow"
        ],
        visualizationSteps: [
            "Start with least significant digit",
            "Group numbers by current digit",
            "Preserve relative order within groups",
            "Reassemble array from groups",
            "Move to next significant digit",
            "Repeat until all digits processed"
        ]
    },

    "Shell Sort": {
        name: "Shell Sort",
        description: "Shell Sort is an optimization of Insertion Sort that allows the exchange of far-apart elements. It starts by sorting elements far apart and progressively reduces the gap between elements. The final pass is an Insertion Sort, but by then the array is nearly sorted, resulting in better efficiency.",
        timeComplexity: {
            best: "O(n log n) - depends on gap sequence",
            average: "O(n^1.25) to O(n^1.5) - varies with sequence",
            worst: "O(n²) - with poor gap sequence"
        },
        spaceComplexity: "O(1) - in-place sorting algorithm",
        pseudocode: `procedure shellSort(A)
    n = length(A)
    gap = n / 2
    
    while gap > 0
        for i = gap to n - 1
            temp = A[i]
            j = i
            while j >= gap and A[j - gap] > temp
                A[j] = A[j - gap]
                j = j - gap
            end while
            A[j] = temp
        end for
        gap = gap / 2
    end while
end procedure`,
        advantages: [
            "Better than O(n²) in practice",
            "In-place sorting - O(1) extra space",
            "Adaptive - good for partially sorted data",
            "Simple implementation",
            "Good for medium-sized arrays"
        ],
        disadvantages: [
            "Unstable sorting algorithm",
            "Performance depends on gap sequence",
            "Not as fast as Quick Sort or Merge Sort",
            "Worst case can be O(n²)"
        ],
        useCases: [
            "Medium-sized datasets",
            "Embedded systems with limited memory",
            "When simplicity with better-than-quadratic time is needed",
            "Partially sorted data"
        ],
        visualizationSteps: [
            "Start with large gap (n/2)",
            "Compare elements gap positions apart",
            "Perform insertion sort with current gap",
            "Reduce gap by half",
            "Repeat until gap is 1",
            "Final pass is standard insertion sort"
        ]
    }
}

export function getHardcodedAlgorithmExplanation(algorithmName: string): AlgorithmExplanation | null {
    return algorithmExplanations[algorithmName] || null
}
