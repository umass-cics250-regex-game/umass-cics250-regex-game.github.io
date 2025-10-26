
document.addEventListener('DOMContentLoaded', function() {
  const privacyButton = document.getElementById('privacyButton');
  const infoWindow = document.getElementById('infoWindow');
  const closeButton = document.getElementById('closeButton');
  const continueButton = document.getElementById('continueToGameBtn');
  const getAnswersButton = document.getElementById('checkAnswersBtn');

  // handles privacy policy popup window
  function showInfoWindow() {
    infoWindow.classList.remove('hidden');
  } 

  function hideInfoWindow() {
    infoWindow.classList.add('hidden');
  }

  privacyButton.addEventListener('click', showInfoWindow);

  closeButton.addEventListener('click', hideInfoWindow);

  /* Check solutions*/
  function checkSolutions() {
    window.scrollTo({
        top: 0, // Scrolls to the top of the page
        behavior: 'smooth' // Provides a smooth scrolling animation
    });
    continueButton.classList.remove('hidden');
    getAnswersButton.classList.add('hidden');
  }

  getAnswersButton.addEventListener('click', checkSolutions);

});

// handles begin event 
document.getElementById('beginBtn').addEventListener('click', function() {
    window.scrollTo({
        top: 0, // Scrolls to the top of the page
        behavior: 'smooth' // Provides a smooth scrolling animation
    });
});

// handles checkAnswer event 
document.getElementById('checkAnswersBtn').addEventListener('click', function() {
    const continueButton = document.getElementById('continueToGameBtn');
    const getAnswersButton = document.getElementById('checkAnswersBtn');
    


    window.scrollTo({
        top: 0, // Scrolls to the top of the page
        behavior: 'smooth' // Provides a smooth scrolling animation
    });
});