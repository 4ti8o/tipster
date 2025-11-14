// Shared JavaScript for API fetches and tip generation logic

// Football Data API key (free tier, no key needed for basic endpoints)
const API_BASE = 'https://api.football-data.org/v4';
const API_KEY = ''; // Free tier doesn't require key for some endpoints

// Function to fetch upcoming matches
async function fetchUpcomingMatches() {
    try {
        const response = await fetch(`${API_BASE}/matches?status=SCHEDULED&limit=20`, {
            headers: { 'X-Auth-Token': API_KEY }
        });
        const data = await response.json();
        return data.matches || [];
    } catch (error) {
        console.error('Error fetching matches:', error);
        return [];
    }
}

// Function to fetch league standings
async function fetchStandings(leagueId) {
    try {
        const response = await fetch(`${API_BASE}/competitions/${leagueId}/standings`, {
            headers: { 'X-Auth-Token': API_KEY }
        });
        const data = await response.json();
        return data.standings[0].table || [];
    } catch (error) {
        console.error('Error fetching standings:', error);
        return [];
    }
}

// Generate simple tip based on league averages (mock logic)
function generateTip(match, type) {
    const homeTeam = match.homeTeam.name;
    const awayTeam = match.awayTeam.name;
    const league = match.competition.name;

    // Simple random logic for demo (in reality, use historical data)
    const random = Math.random();

    switch (type) {
        case 'over1.5':
            return random > 0.4 ? 'Over 1.5' : 'Under 1.5';
        case 'over2.5':
            return random > 0.5 ? 'Over 2.5' : 'Under 2.5';
        case 'over3.5':
            return random > 0.7 ? 'Over 3.5' : 'Under 3.5';
        case 'bbts':
            return random > 0.6 ? 'BTTS Yes' : 'BTTS No';
        default:
            return 'Draw';
    }
}

// Display tips on home page
async function displayDailyTips() {
    const matches = await fetchUpcomingMatches();
    const tipsContainer = document.getElementById('tips-container');

    if (matches.length === 0) {
        tipsContainer.innerHTML = '<p>No upcoming matches found.</p>';
        return;
    }

    // Sort by time
    matches.sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));

    const tipsHtml = matches.map(match => {
        const time = new Date(match.utcDate).toLocaleString();
        const tip = generateTip(match, 'general'); // General tip for home page
        return `
            <div class="prediction">
                <strong>${match.homeTeam.name} vs ${match.awayTeam.name}</strong><br>
                League: ${match.competition.name}<br>
                Time: ${time}<br>
                Tip: ${tip}
            </div>
        `;
    }).join('');

    tipsContainer.innerHTML = tipsHtml;
}

// Display standings
async function displayStandings() {
    const leagues = [
        { id: 'PL', name: 'Premier League' },
        { id: 'PD', name: 'La Liga' },
        { id: 'BL1', name: 'Bundesliga' },
        { id: 'SA', name: 'Serie A' },
        { id: 'FL1', name: 'Ligue 1' },
        // Note: Uganda, Kenya, Tanzania leagues may not be available in free API
        // Using placeholders or mock data
    ];

    const standingsContainer = document.getElementById('standings-container');

    for (const league of leagues) {
        const standings = await fetchStandings(league.id);
        if (standings.length > 0) {
            const tableHtml = `
                <h2>${league.name}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Pos</th>
                            <th>Team</th>
                            <th>P</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${standings.slice(0, 5).map(team => `
                            <tr>
                                <td>${team.position}</td>
                                <td>${team.team.name}</td>
                                <td>${team.playedGames}</td>
                                <td>${team.won}</td>
                                <td>${team.draw}</td>
                                <td>${team.lost}</td>
                                <td>${team.points}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            standingsContainer.innerHTML += tableHtml;
        }
    }
}

// Display predictions for specific type
async function displayPredictions(type) {
    const matches = await fetchUpcomingMatches();
    const predictionsContainer = document.getElementById('predictions-container');

    if (matches.length === 0) {
        predictionsContainer.innerHTML = '<p>No upcoming matches found.</p>';
        return;
    }

    const predictionsHtml = matches.map(match => {
        const time = new Date(match.utcDate).toLocaleString();
        const tip = generateTip(match, type);
        return `
            <div class="prediction">
                <strong>${match.homeTeam.name} vs ${match.awayTeam.name}</strong><br>
                League: ${match.competition.name}<br>
                Time: ${time}<br>
                Prediction: ${tip}
            </div>
        `;
    }).join('');

    predictionsContainer.innerHTML = predictionsHtml;
}

// Load history from JSON
async function loadHistory() {
    try {
        const response = await fetch('history.json');
        const history = await response.json();
        const historyContainer = document.getElementById('history-container');

        const historyHtml = history.slice(0, 50).map(item => `
            <div class="prediction">
                <strong>${item.match}</strong><br>
                Prediction: ${item.prediction}<br>
                Result: ${item.result}<br>
                Date: ${item.date}
            </div>
        `).join('');

        historyContainer.innerHTML = historyHtml;
    } catch (error) {
        console.error('Error loading history:', error);
        document.getElementById('history-container').innerHTML = '<p>Error loading history.</p>';
    }
}

// Initialize based on page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('tips-container')) {
        displayDailyTips();
    }
    if (document.getElementById('standings-container')) {
        displayStandings();
    }
    if (document.getElementById('predictions-container')) {
        const type = document.body.dataset.predictionType;
        displayPredictions(type);
    }
    if (document.getElementById('history-container')) {
        loadHistory();
    }
});
