const gradePoints = {
  'A': 5,
  'B': 4,
  'C': 3,
  'D': 2,
  'E': 1,
  'F': 0
};

let semesterCount = 0;

// Load from localStorage
window.onload = () => {
  const saved = localStorage.getItem('gpaData');
  const theme = localStorage.getItem('darkMode');
  if (theme === 'true') document.body.classList.add('dark');

  if (saved) {
    document.getElementById('semesters').innerHTML = saved;
    semesterCount = document.querySelectorAll('.semester').length;
  } else {
    addSemester();
  }
};

function saveToLocalStorage() {
  localStorage.setItem('gpaData', document.getElementById('semesters').innerHTML);
}

function addSemester() {
  semesterCount++;
  const semesterDiv = document.createElement('div');
  semesterDiv.className = 'semester';
  semesterDiv.setAttribute('data-semester', semesterCount);
  semesterDiv.innerHTML = `
    <label>Semester Title: 
      <input type="text" class="semester-title" value="Semester ${semesterCount}" oninput="saveToLocalStorage()" />
    </label>
    <div class="course-list" id="course-list-${semesterCount}"></div>
    <button onclick="addCourse(${semesterCount})">➕ Add Course</button>
    <button onclick="calculateGPA(${semesterCount})">✅ Calculate GPA</button>
    <div class="gpa-output" id="gpa-output-${semesterCount}"></div>
  `;
  document.getElementById('semesters').appendChild(semesterDiv);
  addCourse(semesterCount);
  saveToLocalStorage();
}

function addCourse(semesterId) {
  const courseList = document.getElementById(`course-list-${semesterId}`);
  const div = document.createElement('div');
  div.className = 'course';
  div.innerHTML = `
    <input type="text" placeholder="Course Name" required />
    <select>
      <option value="">Grade</option>
      <option value="A">A (5)</option>
      <option value="B">B (4)</option>
      <option value="C">C (3)</option>
      <option value="D">D (2)</option>
      <option value="E">E (1)</option>
      <option value="F">F (0)</option>
    </select>
    <input type="number" placeholder="Credit Units" min="1" />
    <button class="delete-btn" onclick="this.parentElement.remove(); saveToLocalStorage()">🗑️</button>
  `;
  courseList.appendChild(div);
  saveToLocalStorage();
}

function calculateGPA(semesterId) {
  const courses = document.querySelectorAll(`#course-list-${semesterId} .course`);
  let totalPoints = 0;
  let totalCredits = 0;

  for (let course of courses) {
    const grade = course.children[1].value;
    const credit = parseFloat(course.children[2].value);
    if (!grade || isNaN(credit)) {
      alert('Fill all fields correctly.');
      return;
    }
    totalPoints += gradePoints[grade] * credit;
    totalCredits += credit;
  }

  const gpa = totalPoints / totalCredits;
  document.getElementById(`gpa-output-${semesterId}`).innerText = `GPA: ${gpa.toFixed(2)}`;
  saveToLocalStorage();
}

function calculateCGPA() {
  let totalPoints = 0;
  let totalCredits = 0;

  for (let i = 1; i <= semesterCount; i++) {
    const courses = document.querySelectorAll(`#course-list-${i} .course`);
    for (let course of courses) {
      const grade = course.children[1].value;
      const credit = parseFloat(course.children[2].value);
      if (!grade || isNaN(credit)) {
        alert(`Please complete all fields in Semester ${i}`);
        return;
      }
      totalPoints += gradePoints[grade] * credit;
      totalCredits += credit;
    }
  }

  const cgpa = totalPoints / totalCredits;
  document.getElementById('cgpa-output').innerText = `🎓 Your CGPA is: ${cgpa.toFixed(2)}`;
  saveToLocalStorage();
}

function exportToPDF() {
  const element = document.body;
  html2pdf()
    .set({
      margin: 0.5,
      filename: 'GPA-CGPA-Report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 }
    })
    .from(element)
    .save();
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}
