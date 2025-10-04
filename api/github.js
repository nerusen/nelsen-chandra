export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME || 'nelsen-chandra';

  if (!token) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  try {
    // Fetch contribution calendar
    const contributionQuery = `
      query {
        user(login: "${username}") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const contributionResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: contributionQuery }),
    });

    if (!contributionResponse.ok) {
      throw new Error(`GitHub API error: ${contributionResponse.status}`);
    }

    const contributionData = await contributionResponse.json();

    // Fetch user profile
    const profileQuery = `
      query {
        user(login: "${username}") {
          avatarUrl
          name
          bio
          location
          company
          followers {
            totalCount
          }
          following {
            totalCount
          }
          repositories(privacy: PUBLIC) {
            totalCount
          }
        }
      }
    `;

    const profileResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: profileQuery }),
    });

    if (!profileResponse.ok) {
      throw new Error(`GitHub API error: ${profileResponse.status}`);
    }

    const profileData = await profileResponse.json();

    // Calculate stats
    const contributionCalendar = contributionData.data.user.contributionsCollection.contributionCalendar;
    const stats = calculateStats(contributionCalendar);

    res.status(200).json({
      contributionCalendar,
      userProfile: profileData.data.user,
      stats,
    });

  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub data' });
  }
}

function calculateStats(contributionCalendar) {
  const weeks = contributionCalendar.weeks;
  let totalContributions = contributionCalendar.totalContributions;
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let yearContributions = 0;

  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);

  // Flatten all days
  const allDays = [];
  weeks.forEach(week => {
    week.contributionDays.forEach(day => {
      allDays.push(day);
    });
  });

  // Sort by date descending (most recent first)
  allDays.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate current streak
  for (const day of allDays) {
    if (day.contributionCount > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  allDays.forEach(day => {
    if (day.contributionCount > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  });

  // Calculate this year contributions
  allDays.forEach(day => {
    const dayDate = new Date(day.date);
    if (dayDate >= yearStart) {
      yearContributions += day.contributionCount;
    }
  });

  return {
    totalContributions,
    currentStreak,
    longestStreak,
    yearContributions
  };
}
