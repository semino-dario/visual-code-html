document.addEventListener("DOMContentLoaded", () => {
  const MAX_ITERATIONS = 10;
  const MIN_ITERATIONS = 1;

  // --- Common Helper Functions ---

  /**
   * Helper function to create an array element div.
   * @param {number} content - The initial number content for the element.
   * @param {number} index - The index number to display.
   * @returns {HTMLDivElement} The created array element.
   */
  function createElement(content, index) {
    const elementDiv = document.createElement("div");
    elementDiv.classList.add("array-element");

    const contentSpan = document.createElement("span");
    contentSpan.classList.add("array-element-content");
    contentSpan.textContent = content;

    const indexSpan = document.createElement("span");
    indexSpan.classList.add("array-index");
    indexSpan.textContent = `index: [${index}]`;

    elementDiv.appendChild(contentSpan);
    elementDiv.appendChild(indexSpan);

    elementDiv.dataset.index = index;
    return elementDiv;
  }

  /**
   * A helper function to create a time delay.
   * @param {number} ms - The delay in milliseconds.
   * @returns {Promise<void>} A promise that resolves after the specified delay.
   */
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Handles input validation and updates UI for a given visualizer.
   * @param {HTMLInputElement} inputElement - The input field.
   * @param {HTMLButtonElement} buttonElement - The start button.
   * @param {HTMLElement} messageElement - The validation message span.
   * @param {HTMLElement} statusContainer - The loop status container.
   * @param {HTMLElement} arrayContainer - The array elements container.
   * @param {function(number)} initializerFunction - The function to initialize the array display.
   */
  function handleInputValidation(
    inputElement,
    buttonElement,
    messageElement,
    statusContainer,
    arrayContainer,
    initializerFunction
  ) {
    let inputValue = inputElement.value;
    let currentSize = parseInt(inputValue);

    // --- Always reset/hide displays at the beginning ---
    messageElement.classList.add("hidden");
    statusContainer.classList.add("hidden");
    arrayContainer.classList.add("hidden");
    arrayContainer.innerHTML = ""; // Clear previous elements
    buttonElement.disabled = true;

    if (inputValue === "") {
      return;
    }

    const isNumeric = !isNaN(currentSize);
    const isWithinRange =
      isNumeric &&
      currentSize >= MIN_ITERATIONS &&
      currentSize <= MAX_ITERATIONS;

    if (isWithinRange) {
      statusContainer.classList.remove("hidden");
      arrayContainer.classList.remove("hidden");
      initializerFunction(currentSize); // Call the appropriate initializer
      buttonElement.disabled = false;
    } else {
      messageElement.classList.remove("hidden");
      inputElement.value = ""; // Erase the invalid input
    }
  }

  // --- 1. Loop Visualizer Setup ---
  const loopElements = {
    arraySizeInput: document.getElementById("arraySize"),
    startButton: document.getElementById("startButton"),
    validationMessageSpan: document.getElementById("validationMessage"),
    arrayContainer: document.getElementById("arrayContainer"),
    loopStatusContainer: document.querySelector(
      ".container:nth-child(1) .loop-status-container"
    ),
    loopVariableSpan: document.getElementById("loopVariable"),
    equalSignSpan: document.getElementById("equalSign"),
    arrayLengthSpan: document.getElementById("arrayLength"),
  };

  loopElements.arraySizeInput.max = MAX_ITERATIONS;
  loopElements.arraySizeInput.min = MIN_ITERATIONS;
  loopElements.startButton.addEventListener("click", startLoopAnimation);
  loopElements.startButton.disabled = true;

  loopElements.arraySizeInput.addEventListener("input", () => {
    handleInputValidation(
      loopElements.arraySizeInput,
      loopElements.startButton,
      loopElements.validationMessageSpan,
      loopElements.loopStatusContainer,
      loopElements.arrayContainer,
      initializeLoopArray
    );
  });

  function initializeLoopArray(size) {
    loopElements.arrayContainer.innerHTML = "";
    for (let i = 0; i < size; i++) {
      const elementDiv = createElement(i + 1, i);
      loopElements.arrayContainer.appendChild(elementDiv);
    }
    loopElements.loopVariableSpan.textContent = 0;
    loopElements.arrayLengthSpan.textContent = size;
    // Ensure '=' and 'length' are visible for the loop visualizer
    loopElements.equalSignSpan.classList.remove("hidden");
    loopElements.arrayLengthSpan.classList.remove("hidden");
    loopElements.equalSignSpan.classList.remove("animate-end");
  }

  async function startLoopAnimation() {
    let size = parseInt(loopElements.arraySizeInput.value);

    if (
      isNaN(size) ||
      size < MIN_ITERATIONS ||
      size > MAX_ITERATIONS ||
      loopElements.arraySizeInput.value === ""
    ) {
      loopElements.arraySizeInput.value = "";
      loopElements.validationMessageSpan.classList.remove("hidden");
      loopElements.startButton.disabled = true;
      loopElements.loopStatusContainer.classList.add("hidden");
      loopElements.arrayContainer.classList.add("hidden");
      loopElements.arrayContainer.innerHTML = "";
      return;
    }

    loopElements.loopStatusContainer.classList.remove("hidden");
    loopElements.arrayContainer.classList.remove("hidden");
    initializeLoopArray(size);

    const elements =
      loopElements.arrayContainer.querySelectorAll(".array-element");
    loopElements.startButton.disabled = true;
    loopElements.arraySizeInput.disabled = true;

    for (let i = 0; i < elements.length; i++) {
      loopElements.loopVariableSpan.textContent = i;
      const currentElement = elements[i];
      const currentContentSpan = currentElement.querySelector(
        ".array-element-content"
      );

      currentElement.classList.add("highlight");
      await delay(500);

      currentContentSpan.textContent = "😊";
      currentElement.classList.add("face");
      currentElement.classList.remove("highlight");
      await delay(700);
    }

    loopElements.loopVariableSpan.textContent = elements.length;
    loopElements.equalSignSpan.classList.add("animate-end");

    loopElements.startButton.disabled = false;
    loopElements.arraySizeInput.disabled = false;
  }

  // --- 2. Recursive Visualizer - Unwinding Phase Setup ---
  const recursionUnwindingElements = {
    arraySizeInput: document.getElementById("recursionUnwindingArraySize"),
    startButton: document.getElementById("recursionUnwindingStartButton"),
    validationMessageSpan: document.getElementById(
      "recursionUnwindingValidationMessage"
    ),
    arrayContainer: document.getElementById("recursionUnwindingArrayContainer"),
    loopStatusContainer: document.querySelector(
      ".recursion-container .loop-status-container"
    ),
    loopVariableSpan: document.getElementById("recursionUnwindingLoopVariable"),
    equalSignSpan: document.getElementById("recursionUnwindingEqualSign"),
    arrayLengthSpan: document.getElementById("recursionUnwindingArrayLength"),
  };

  recursionUnwindingElements.arraySizeInput.max = MAX_ITERATIONS;
  recursionUnwindingElements.arraySizeInput.min = MIN_ITERATIONS;
  recursionUnwindingElements.startButton.addEventListener(
    "click",
    startRecursionUnwindingAnimation
  );
  recursionUnwindingElements.startButton.disabled = true;

  recursionUnwindingElements.arraySizeInput.addEventListener("input", () => {
    handleInputValidation(
      recursionUnwindingElements.arraySizeInput,
      recursionUnwindingElements.startButton,
      recursionUnwindingElements.validationMessageSpan,
      recursionUnwindingElements.loopStatusContainer,
      recursionUnwindingElements.arrayContainer,
      initializeRecursionUnwindingArray
    );
  });

  function initializeRecursionUnwindingArray(size) {
    recursionUnwindingElements.arrayContainer.innerHTML = "";
    for (let i = 0; i < size; i++) {
      const elementDiv = createElement(i + 1, i);
      recursionUnwindingElements.arrayContainer.appendChild(elementDiv);
    }
    recursionUnwindingElements.loopVariableSpan.textContent = size;
    recursionUnwindingElements.arrayLengthSpan.textContent = size; // Still set for consistency but will be hidden

    // *** CHANGES FOR UNWINDING PHASE ***
    recursionUnwindingElements.equalSignSpan.classList.add("hidden"); // Hide '='
    recursionUnwindingElements.arrayLengthSpan.classList.add("hidden"); // Hide 'length'
    recursionUnwindingElements.loopVariableSpan.classList.remove("animate-end"); // Ensure not animated initially
  }

  async function startRecursionUnwindingAnimation() {
    let size = parseInt(recursionUnwindingElements.arraySizeInput.value);

    if (
      isNaN(size) ||
      size < MIN_ITERATIONS ||
      size > MAX_ITERATIONS ||
      recursionUnwindingElements.arraySizeInput.value === ""
    ) {
      recursionUnwindingElements.arraySizeInput.value = "";
      recursionUnwindingElements.validationMessageSpan.classList.remove(
        "hidden"
      );
      recursionUnwindingElements.startButton.disabled = true;
      recursionUnwindingElements.loopStatusContainer.classList.add("hidden");
      recursionUnwindingElements.arrayContainer.classList.add("hidden");
      recursionUnwindingElements.arrayContainer.innerHTML = "";
      return;
    }

    recursionUnwindingElements.loopStatusContainer.classList.remove("hidden");
    recursionUnwindingElements.arrayContainer.classList.remove("hidden");
    initializeRecursionUnwindingArray(size); // This will hide '=' and 'length'

    const elements =
      recursionUnwindingElements.arrayContainer.querySelectorAll(
        ".array-element"
      );
    recursionUnwindingElements.startButton.disabled = true;
    recursionUnwindingElements.arraySizeInput.disabled = true;

    await animateRecursiveUnwindingCall(
      size - 1,
      elements,
      recursionUnwindingElements.loopVariableSpan
    );

    recursionUnwindingElements.loopVariableSpan.textContent =
      MIN_ITERATIONS - 1;
    // *** CHANGE: Add animate-end to the loop variable span ***
    recursionUnwindingElements.loopVariableSpan.classList.add("animate-end");

    recursionUnwindingElements.startButton.disabled = false;
    recursionUnwindingElements.arraySizeInput.disabled = false;
  }

  async function animateRecursiveUnwindingCall(
    index,
    elements,
    loopVariableSpan
  ) {
    if (index < 0) {
      return;
    }

    loopVariableSpan.textContent = index;
    const currentElement = elements[index];
    currentElement.classList.add("recursion-element-calling");
    await delay(500);

    await animateRecursiveUnwindingCall(index - 1, elements, loopVariableSpan);

    const currentContentSpan = currentElement.querySelector(
      ".array-element-content"
    );
    currentElement.classList.remove("recursion-element-calling");

    currentContentSpan.textContent = "😊";
    currentElement.classList.add("face");
    await delay(700);
  }

  // --- 3. Recursive Visualizer - Calling Phase Setup ---
  const recursionCallingElements = {
    arraySizeInput: document.getElementById("recursionCallingArraySize"),
    startButton: document.getElementById("recursionCallingStartButton"),
    validationMessageSpan: document.getElementById(
      "recursionCallingValidationMessage"
    ),
    arrayContainer: document.getElementById("recursionCallingArrayContainer"),
    loopStatusContainer: document.querySelector(
      ".recursion-calling-container .loop-status-container"
    ),
    loopVariableSpan: document.getElementById("recursionCallingLoopVariable"),
    equalSignSpan: document.getElementById("recursionCallingEqualSign"),
    arrayLengthSpan: document.getElementById("recursionCallingArrayLength"),
  };

  recursionCallingElements.arraySizeInput.max = MAX_ITERATIONS;
  recursionCallingElements.arraySizeInput.min = MIN_ITERATIONS;
  recursionCallingElements.startButton.addEventListener(
    "click",
    startRecursionCallingAnimation
  );
  recursionCallingElements.startButton.disabled = true;

  recursionCallingElements.arraySizeInput.addEventListener("input", () => {
    handleInputValidation(
      recursionCallingElements.arraySizeInput,
      recursionCallingElements.startButton,
      recursionCallingElements.validationMessageSpan,
      recursionCallingElements.loopStatusContainer,
      recursionCallingElements.arrayContainer,
      initializeRecursionCallingArray
    );
  });

  function initializeRecursionCallingArray(size) {
    recursionCallingElements.arrayContainer.innerHTML = "";
    for (let i = 0; i < size; i++) {
      const elementDiv = createElement(i + 1, i);
      recursionCallingElements.arrayContainer.appendChild(elementDiv);
    }
    recursionCallingElements.loopVariableSpan.textContent = size - 1; // Start from max index
    recursionCallingElements.arrayLengthSpan.textContent = size; // Still set for consistency but will be hidden

    // *** CHANGES FOR CALLING PHASE ***
    recursionCallingElements.equalSignSpan.classList.add("hidden"); // Hide '='
    recursionCallingElements.arrayLengthSpan.classList.add("hidden"); // Hide 'length'
    recursionCallingElements.loopVariableSpan.classList.remove("animate-end"); // Ensure not animated initially
  }

  async function startRecursionCallingAnimation() {
    let size = parseInt(recursionCallingElements.arraySizeInput.value);

    if (
      isNaN(size) ||
      size < MIN_ITERATIONS ||
      size > MAX_ITERATIONS ||
      recursionCallingElements.arraySizeInput.value === ""
    ) {
      recursionCallingElements.arraySizeInput.value = "";
      recursionCallingElements.validationMessageSpan.classList.remove("hidden");
      recursionCallingElements.startButton.disabled = true;
      recursionCallingElements.loopStatusContainer.classList.add("hidden");
      recursionCallingElements.arrayContainer.classList.add("hidden");
      recursionCallingElements.arrayContainer.innerHTML = "";
      return;
    }

    recursionCallingElements.loopStatusContainer.classList.remove("hidden");
    recursionCallingElements.arrayContainer.classList.remove("hidden");
    initializeRecursionCallingArray(size); // This will hide '=' and 'length'

    const elements =
      recursionCallingElements.arrayContainer.querySelectorAll(
        ".array-element"
      );
    recursionCallingElements.startButton.disabled = true;
    recursionCallingElements.arraySizeInput.disabled = true;

    await animateRecursiveCallingCall(
      size - 1,
      elements,
      recursionCallingElements.loopVariableSpan
    );

    recursionCallingElements.loopVariableSpan.textContent = MIN_ITERATIONS - 1;
    // *** CHANGE: Add animate-end to the loop variable span ***
    recursionCallingElements.loopVariableSpan.classList.add("animate-end");

    recursionCallingElements.startButton.disabled = false;
    recursionCallingElements.arraySizeInput.disabled = false;
  }

  async function animateRecursiveCallingCall(
    index,
    elements,
    loopVariableSpan
  ) {
    if (index < 0) {
      return;
    }

    loopVariableSpan.textContent = index;
    const currentElement = elements[index];
    const currentContentSpan = currentElement.querySelector(
      ".array-element-content"
    );

    currentElement.classList.add("recursion-calling-element-active");
    await delay(500);

    currentContentSpan.textContent = "😊";
    currentElement.classList.add("face");
    await delay(700);

    await animateRecursiveCallingCall(index - 1, elements, loopVariableSpan);

    currentElement.classList.remove("recursion-calling-element-active");
    await delay(100);
  }
});
