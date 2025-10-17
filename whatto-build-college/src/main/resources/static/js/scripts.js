// Recommendation form handler
document.getElementById('recommendForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const branch = document.getElementById('branch').value;
    const skills = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    
    try {
        const response = await fetch('/api/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentId, branch, skills })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayRecommendations(data.recommendations);
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

function displayRecommendations(recommendations) {
    const resultsDiv = document.getElementById('results');
    const listDiv = document.getElementById('recommendationsList');
    
    listDiv.innerHTML = '';
    
    recommendations.forEach((rec, index) => {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${rec.project.name}</h5>
                <p class="card-text">${rec.project.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="badge bg-primary me-2">Match: ${Math.round(rec.matchScore * 100)}%</span>
                        <span class="badge bg-secondary">${rec.project.difficulty}</span>
                    </div>
                    <small class="text-muted">${rec.project.estimatedHours} hours</small>
                </div>
                <div class="mt-3">
                    <h6>Why this project?</h6>
                    <p class="small">${rec.reasoning}</p>
                    <h6>Resume Points:</h6>
                    <p class="small">${rec.resumePoints}</p>
                </div>
            </div>
        `;
        listDiv.appendChild(card);
    });
    
    resultsDiv.style.display = 'block';
}

// Repository analysis form handler
document.getElementById('analyzeForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const repoUrl = document.getElementById('repoUrl').value;
    const studentId = document.getElementById('studentId').value;
    
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ repoUrl, studentId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayAnalysis(data.analysis);
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

function displayAnalysis(analysis) {
    const resultsDiv = document.getElementById('analysisResults');
    resultsDiv.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5>Repository Analysis: ${analysis.repoUrl}</h5>
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Complexity:</strong> ${analysis.complexity}</p>
                        <p><strong>Code Quality:</strong> ${analysis.codeQuality}</p>
                        <p><strong>Technologies:</strong> ${analysis.technologies.join(', ')}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Estimated Hours:</strong> ${analysis.estimatedHours}</p>
                        <p><strong>Skill Gaps:</strong> ${analysis.skillGaps.join(', ')}</p>
                    </div>
                </div>
                <h6>Suggestions:</h6>
                <ul>
                    ${analysis.suggestions.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    resultsDiv.style.display = 'block';
}

