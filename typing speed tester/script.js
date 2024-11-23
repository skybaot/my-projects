// DOM Elements
const codeDisplay = document.getElementById('codeDisplay');
const codeInput = document.getElementById('codeInput');
const timeDisplay = document.getElementById('time');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const cpmDisplay = document.getElementById('cpm');
const resetButton = document.getElementById('resetButton');
const resultsSection = document.getElementById('results');
const finalWpm = document.getElementById('finalWpm');
const finalAccuracy = document.getElementById('finalAccuracy');
const finalCpm = document.getElementById('finalCpm');
const finalErrors = document.getElementById('finalErrors');
const themeToggle = document.querySelector('.theme-toggle');
const languageCards = document.querySelectorAll('.language-card');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

// Add slider navigation functionality
const languageCardsContainer = document.querySelector('.language-cards');
let currentSlideIndex = 0;
const cardWidth = 120; // Width of each card + gap

function navigateLanguages(direction) {
    const maxScroll = languageCardsContainer.scrollWidth - languageCardsContainer.clientWidth;
    const scrollAmount = direction === 'prev' ? -cardWidth : cardWidth;
    
    const newScrollLeft = languageCardsContainer.scrollLeft + scrollAmount;
    
    // Ensure we don't scroll beyond boundaries
    if (newScrollLeft >= 0 && newScrollLeft <= maxScroll) {
        languageCardsContainer.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    }
}

prevButton.addEventListener('click', () => navigateLanguages('prev'));
nextButton.addEventListener('click', () => navigateLanguages('next'));

// State variables
let currentLanguage = 'javascript';
let currentDifficulty = 'easy';
let timer = null;
let timeLeft = 60;
let isTestActive = false;
let totalKeystrokes = 0;
let errorCount = 0;
let startTime = null;

// Code snippets for different languages and difficulties
const codeSnippets = {
    javascript: {
        easy: [
            `function calculateSum(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}`,
            `const greet = (name) => {
    console.log(\`Hello, \${name}!\`);
};`
        ],
        medium: [
            `function quickSort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[0];
    const left = arr.slice(1).filter(x => x < pivot);
    const right = arr.slice(1).filter(x => x >= pivot);
    return [...quickSort(left), pivot, ...quickSort(right)];
}`,
            `class BinarySearchTree {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}`
        ]
    },
    python: {
        easy: [
            `def calculate_average(numbers):
    return sum(numbers) / len(numbers)`,
            `def is_palindrome(text):
    return text == text[::-1]`
        ],
        medium: [
            `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)`,
            `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None`
        ]
    },
    java: {
        easy: [
            `public class Calculator {
    public static int add(int a, int b) {
        return a + b;
    }
}`,
            `public boolean isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i <= Math.sqrt(n); i++) {
        if (n % i == 0) return false;
    }
    return true;
}`
        ],
        medium: [
            `public class LinkedList<T> {
    private Node<T> head;
    private int size;
    
    private static class Node<T> {
        T data;
        Node<T> next;
        
        Node(T data) {
            this.data = data;
            this.next = null;
        }
    }
}`,
            `public void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
        ]
    },
    cpp: {
        easy: [
            `int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
            `void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}`
        ],
        medium: [
            `template<typename T>
class Stack {
private:
    vector<T> elements;
public:
    void push(T element) {
        elements.push_back(element);
    }
    
    T pop() {
        if (elements.empty()) {
            throw runtime_error("Stack is empty");
        }
        T element = elements.back();
        elements.pop_back();
        return element;
    }
};`,
            `void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}`
        ]
    },
    ruby: {
        easy: [
            `def fibonacci(n)
  return n if n <= 1
  fibonacci(n-1) + fibonacci(n-2)
end`,
            `def reverse_string(str)
  str.reverse
end`
        ],
        medium: [
            `class BinaryTree
  attr_accessor :value, :left, :right
  
  def initialize(value)
    @value = value
    @left = nil
    @right = nil
  end
  
  def insert(new_value)
    if new_value <= @value
      @left.nil? ? @left = BinaryTree.new(new_value) : @left.insert(new_value)
    else
      @right.nil? ? @right = BinaryTree.new(new_value) : @right.insert(new_value)
    end
  end
end`,
            `def quick_sort(array)
  return array if array.length <= 1
  
  pivot = array.delete_at(rand(array.length))
  left = array.select { |num| num < pivot }
  right = array.select { |num| num >= pivot }
  
  quick_sort(left) + [pivot] + quick_sort(right)
end`
        ]
    }
};

// Theme handling
let isDarkTheme = true;
themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('light-theme');
    themeToggle.innerHTML = isDarkTheme ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
});

// Language selection
languageCards.forEach(card => {
    card.addEventListener('click', () => {
        document.querySelector('.language-card.active')?.classList.remove('active');
        card.classList.add('active');
        currentLanguage = card.dataset.language;
        resetTest();
    });
});

// Difficulty selection
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.difficulty-btn.active')?.classList.remove('active');
        button.classList.add('active');
        currentDifficulty = button.dataset.difficulty;
        resetTest();
    });
});

// Get random code snippet
function getRandomCodeSnippet() {
    const snippets = codeSnippets[currentLanguage][currentDifficulty];
    return snippets[Math.floor(Math.random() * snippets.length)];
}

// Initialize test
function initializeTest() {
    const codeSnippet = getRandomCodeSnippet();
    codeDisplay.textContent = codeSnippet;
    codeInput.value = '';
    timeLeft = 60;
    isTestActive = false;
    totalKeystrokes = 0;
    errorCount = 0;
    startTime = null;
    
    updateStats(0, 100, 0);
    resultsSection.classList.add('hidden');
    
    timeDisplay.textContent = timeLeft;
    codeInput.disabled = false;
}

// Update statistics
function updateStats(wpm, accuracy, cpm) {
    wpmDisplay.textContent = Math.round(wpm);
    accuracyDisplay.textContent = Math.round(accuracy);
    cpmDisplay.textContent = Math.round(cpm);
}

// Calculate WPM
function calculateWPM(timeElapsed, correctCharacters) {
    const minutes = timeElapsed / 60;
    const words = correctCharacters / 5;
    return words / minutes;
}

// Calculate accuracy
function calculateAccuracy(totalCharacters, errors) {
    if (totalCharacters === 0) return 100;
    return ((totalCharacters - errors) / totalCharacters) * 100;
}

// Update timer
function updateTimer() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    
    if (timeLeft <= 0) {
        endTest();
    }
}

// Start test
function startTest() {
    if (!isTestActive) {
        isTestActive = true;
        startTime = Date.now();
        timer = setInterval(updateTimer, 1000);
    }
}

// End test
function endTest() {
    clearInterval(timer);
    codeInput.disabled = true;
    isTestActive = false;
    
    const timeElapsed = (Date.now() - startTime) / 1000;
    const correctCharacters = codeInput.value.length - errorCount;
    const wpm = calculateWPM(timeElapsed, correctCharacters);
    const accuracy = calculateAccuracy(codeInput.value.length, errorCount);
    const cpm = (correctCharacters / timeElapsed) * 60;
    
    // Update final results
    finalWpm.textContent = Math.round(wpm);
    finalAccuracy.textContent = Math.round(accuracy) + '%';
    finalCpm.textContent = Math.round(cpm);
    finalErrors.textContent = errorCount;
    
    resultsSection.classList.remove('hidden');
}

// Handle input
codeInput.addEventListener('input', () => {
    if (!isTestActive && codeInput.value.length > 0) {
        startTest();
    }
    
    const expectedText = codeDisplay.textContent;
    const currentText = codeInput.value;
    let currentErrors = 0;
    
    // Calculate errors
    for (let i = 0; i < currentText.length; i++) {
        if (currentText[i] !== expectedText[i]) {
            currentErrors++;
        }
    }
    
    errorCount = currentErrors;
    totalKeystrokes = currentText.length;
    
    // Update real-time statistics
    if (startTime) {
        const timeElapsed = (Date.now() - startTime) / 1000;
        const correctCharacters = totalKeystrokes - errorCount;
        const wpm = calculateWPM(timeElapsed, correctCharacters);
        const accuracy = calculateAccuracy(totalKeystrokes, errorCount);
        const cpm = (correctCharacters / timeElapsed) * 60;
        
        updateStats(wpm, accuracy, cpm);
    }
    
    // Highlight errors in the display
    const displayText = expectedText.split('').map((char, index) => {
        if (index >= currentText.length) {
            return char;
        }
        return currentText[index] === char ? 
            `<span class="correct">${char}</span>` : 
            `<span class="error">${char}</span>`;
    }).join('');
    
    codeDisplay.innerHTML = displayText;
});

// Reset test
resetButton.addEventListener('click', resetTest);

function resetTest() {
    clearInterval(timer);
    initializeTest();
}

// Initialize the test when the page loads
initializeTest();
