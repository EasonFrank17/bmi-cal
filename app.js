// Get DOM elements
const ageInput = document.getElementById('age');
const genderSelect = document.getElementById('gender');
const weightInput = document.getElementById('weight');
const metersInput = document.getElementById('meters');
const feetInput = document.getElementById('feet');
const inchesInput = document.getElementById('inches');
const calculateBtn = document.getElementById('calculate');
const resultsSection = document.getElementById('results');
const expandBtn = document.querySelector('.expand-btn');
const unitBtns = document.querySelectorAll('.unit-btn');
const metricInput = document.querySelector('.metric-input');
const imperialInput = document.querySelector('.imperial-input');

// Initialize unit toggle
unitBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    unitBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    if (btn.dataset.unit === 'feet') {
      metricInput.style.display = 'none';
      imperialInput.style.display = 'flex';
    } else {
      metricInput.style.display = 'block';
      imperialInput.style.display = 'none';
    }
  });
});

// Initialize expand button
expandBtn.addEventListener('click', () => {
  const arrow = expandBtn.querySelector('.arrow-down');
  arrow.textContent = arrow.textContent === '▼' ? '▲' : '▼';
});

// Validate inputs
function validateInputs() {
  if (!ageInput.value || ageInput.value < 0 || ageInput.value > 120) {
    alert('Please enter a valid age (0-120 years)');
    return false;
  }
  
  if (!genderSelect.value) {
    alert('Please select a gender');
    return false;
  }
  
  if (!weightInput.value || weightInput.value <= 0) {
    alert('Please enter a valid weight');
    return false;
  }
  
  return true;
}

// Get health recommendations
function getHealthRecommendations(bmi, age, gender) {
  const recommendations = [];
  
  if (bmi < 18.5) {
    recommendations.push('Increase daily caloric intake while maintaining balanced nutrition');
    recommendations.push('Engage in moderate strength training to build muscle mass');
    if (gender === 'female') {
      recommendations.push('Focus on calcium and iron supplementation');
    }
  } else if (bmi < 24.9) {
    recommendations.push('Maintain your current healthy lifestyle');
    recommendations.push('Engage in 150 minutes of moderate-intensity exercise weekly');
    if (age > 40) {
      recommendations.push('Schedule regular check-ups, monitor cardiovascular health');
    }
  } else if (bmi < 29.9) {
    recommendations.push('Control daily caloric intake and increase physical activity');
    recommendations.push('Choose low-fat, high-protein foods');
    if (age > 50) {
      recommendations.push('Mind joint health, opt for low-impact exercises');
    }
  } else {
    recommendations.push('Consult healthcare professionals for a weight management plan');
    recommendations.push('Perform at least 30 minutes of aerobic exercise daily');
    recommendations.push('Control carbohydrate intake and increase vegetable consumption');
  }
  
  return recommendations.map(rec => `<li>${rec}</li>`).join('');
}

// Initialize calculate button
calculateBtn.addEventListener('click', () => {
  if (!validateInputs()) {
    return;
  }
  
  const age = parseInt(ageInput.value);
  const gender = genderSelect.value;
  const weight = parseFloat(weightInput.value);
  
  // Get height in meters
  let heightInMeters = 0;
  const activeUnit = document.querySelector('.unit-btn.active').dataset.unit;
  
  if (activeUnit === 'feet') {
    if (feetInput.value && inchesInput.value) {
      const feet = parseInt(feetInput.value);
      const inches = parseInt(inchesInput.value);
      const totalInches = (feet * 12) + inches;
      heightInMeters = totalInches * 0.0254;
    }
  } else {
    if (metersInput.value) {
      heightInMeters = parseFloat(metersInput.value);
    }
  }
  
  if (!heightInMeters) {
    alert('Please enter valid height data');
    return;
  }
  
  // Calculate BMI
  const bmi = weight / (heightInMeters * heightInMeters);
  
  // Determine BMI category
  let category = '';
  let categoryColor = '';
  
  if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = '#3498db';
  } else if (bmi < 24.9) {
    category = 'Healthy Weight';
    categoryColor = '#2ecc71';
  } else if (bmi < 29.9) {
    category = 'Overweight';
    categoryColor = '#f39c12';
  } else {
    category = 'Obese';
    categoryColor = '#e74c3c';
  }
  
  // Display results
  resultsSection.style.display = 'block';
  resultsSection.innerHTML = `
    <h2>Your BMI Results</h2>
    <div class="bmi-result">
      <div class="bmi-value">${bmi.toFixed(1)}</div>
      <div class="bmi-category" style="color: ${categoryColor}">${category}</div>
    </div>
    <div class="bmi-scale">
      <div class="scale-bar">
        <div class="scale-marker" style="left: ${Math.min(100, Math.max(0, (bmi - 10) * 3))}%"></div>
        <div class="scale-segments">
          <div class="segment segment-1">Underweight</div>
          <div class="segment segment-2">Healthy Weight</div>
          <div class="segment segment-3">Overweight</div>
          <div class="segment segment-4">Obese</div>
        </div>
      </div>
    </div>
    <div class="health-insights">
      <h3>Health Insights</h3>
      <p>Based on your BMI of ${bmi.toFixed(1)} (${category}), here are some health recommendations:</p>
      <ul>
        ${getHealthRecommendations(bmi, age, gender)}
      </ul>
    </div>
  `;
});