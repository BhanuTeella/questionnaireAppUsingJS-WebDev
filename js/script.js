// Function to load JSON data from a file
function loadJSON(callback) {
  const xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', 'questions.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState === 4 && xobj.status === 200) {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}



// Function to generate the questionnaire
function generateQuestionnaire() {
  // Get the div element where the questionnaire will be displayed
  const questionnaireDiv = document.getElementById('questionnaire');

  // Load the JSON data and generate the questionnaire
  loadJSON(function (response) {
    // Parse the JSON data into an array of topics and questions
    const questions = JSON.parse(response);

    // Initialize the current topic index to zero
    let currentTopicIndex = 0;

    // Initialize the user's responses and score
    const userResponses = {};
    let score = 0;

    // Loop through each topic in the JSON data and create a div element for each topic
    questions.forEach((topic, topicIndex) => {
      const topicDiv = createTopicDiv(topic, topicIndex, questions.length);
      questionnaireDiv.appendChild(topicDiv);
    });

    // Function to show the next topic in the questionnaire
    function showNextTopic() {
      const nextTopicIndex = currentTopicIndex + 1;
      if (nextTopicIndex < questions.length) {
        hideCurrentTopic();
        showTopic(nextTopicIndex);
        currentTopicIndex = nextTopicIndex;
      } else {
        calculateScore();
        alert(`You have completed the questionnaire! Your score is ${score} out of ${Object.keys(userResponses).length}.`);
      }
    }

    // Function to calculate the user's score
    function calculateScore() {
      const topicScores = {};
      questions.forEach((topic, topicIndex) => {
        topicScores[topicIndex] = 0;
        topic.questions.forEach((question, questionIndex) => {
          const response = userResponses[`${topicIndex}-${questionIndex}`];
          if (response == question.answer) {
            topicScores[topicIndex]++;
          }
        });
      });
      score = Object.values(topicScores).reduce((total, topicScore) => total + topicScore, 0);
      displayScore(topicScores);
    }

    // Function to create a div element for a topic
    function createTopicDiv(topic, topicIndex, numTopics) {
      const topicDiv = document.createElement('div');
      topicDiv.id = `topic${topicIndex + 1}`;
      topicDiv.className = 'topic';
      if (topicIndex === 0) {
        topicDiv.classList.add('active');
      }
      createTitleElement(topic, topicDiv);
      createQuestionElements(topic, topicIndex, topicDiv);
      createSubmitButton(topicIndex, numTopics, topicDiv);
      return topicDiv;
    }

    // Function to create a title element for a topic
    function createTitleElement(topic, topicDiv) {
      const title = document.createElement('h1');
      title.textContent = topic.topic;
      topicDiv.appendChild(title);
    }

    // Function to create question elements for a topic
    function createQuestionElements(topic, topicIndex, topicDiv) {
      topic.questions.forEach((question, questionIndex) => {
        const questionParagraph = document.createElement('p');
        questionParagraph.textContent = question.question;
        topicDiv.appendChild(questionParagraph);
        createOptionElements(question, topicIndex, questionIndex, topicDiv);
      });
    }

    // Function to create option elements for a question
    function createOptionElements(question, topicIndex, questionIndex, topicDiv) {
      question.options.forEach((option, optionIndex) => {
        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = `answer${topicIndex * 3 + questionIndex + 1}`;
        optionInput.value = option;
        optionInput.addEventListener('change', () => {
          userResponses[`${topicIndex}-${questionIndex}`] = parseInt(optionInput.value);
        });
        topicDiv.appendChild(optionInput);

        const optionLabel = document.createElement('label');
        optionLabel.textContent = option;
        topicDiv.appendChild(optionLabel);

        topicDiv.appendChild(document.createElement('br'));
      });
    }

    // Function to create a submit button for a topic
    function createSubmitButton(topicIndex, numTopics, topicDiv) {
      const submitButton = document.createElement('button');
      submitButton.textContent = topicIndex === numTopics - 1 ? 'Submit Answers' : 'Save and Continue';
      submitButton.addEventListener('click', () => {
        const currentTopic = document.getElementById(`topic${topicIndex + 1}`);
        const answerInputs = currentTopic.querySelectorAll('input[type="radio"]:checked');
        console.log(answerInputs);
        console.log(currentTopic);
        console.log(currentTopic.querySelectorAll('input[type="radio"]').length);
        if (answerInputs.length === currentTopic.querySelectorAll('input[type="radio"]:checked').length) {
          showNextTopic();
        } else {
          alert('Please answer all questions before submitting.');
        }
      });
      topicDiv.appendChild(submitButton);
    }

    // Function to hide the current topic
    function hideCurrentTopic() {
      const currentTopic = document.getElementById(`topic${currentTopicIndex + 1}`);
      currentTopic.classList.remove('active');
    }

    // Function to show a topic
    function showTopic(topicIndex) {
      const nextTopic = document.getElementById(`topic${topicIndex + 1}`);
      nextTopic.classList.add('active');
    }

    // Function to display the topic-wise and total scores on the page
    function displayScore(topicScores) {
      const scoreContainer = document.getElementById('score-container');
      scoreContainer.innerHTML = `<h2>Total Score: ${score} out of ${Object.keys(userResponses).length}.</h2>`;
      questions.forEach((topic, topicIndex) => {
        const topicScore = topicScores[topicIndex];
        const topicElement = document.createElement('div');
        topicElement.innerHTML = `<h3>${topic.topic}: ${topicScore} out of ${topic.questions.length}</h3>`;
        scoreContainer.appendChild(topicElement);
      });
    }
  });
}
// Call the generateQuestionnaire function to generate the questionnaire on page load
generateQuestionnaire();