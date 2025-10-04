// ============================================
// PORTFOLIO WEBSITE - MAIN JAVASCRIPT
// Author: Nelsen Chandra
// Description: Handles all interactive functionality
// ============================================

// ============================================
// LANGUAGE MANAGEMENT
// ============================================
const translations = {
  en: {
    home: "Home",
    about: "About",
    achievements: "Achievements",
    projects: "Projects",
    contact: "Contact",
    official: "Official",
  },
  id: {
    home: "Beranda",
    about: "Tentang",
    achievements: "Pencapaian",
    projects: "Proyek",
    contact: "Kontak",
    official: "Official",
  },
}

let currentLang = localStorage.getItem("language") || "en"

// Initialize language on page load
function initLanguage() {
  updateLanguage(currentLang)
  updateLanguageToggle()
}

// Update all text elements based on selected language
function updateLanguage(lang) {
  currentLang = lang
  localStorage.setItem("language", lang)

  document.querySelectorAll("[data-en]").forEach((element) => {
    const enText = element.getAttribute("data-en")
    const idText = element.getAttribute("data-id")

    if (enText && idText) {
      element.innerHTML = lang === "en" ? enText : idText
    }
  })

  const searchInput = document.getElementById("achievementSearch")
  if (searchInput) {
    const placeholderEn = searchInput.getAttribute("data-placeholder-en")
    const placeholderId = searchInput.getAttribute("data-placeholder-id")
    if (placeholderEn && placeholderId) {
      searchInput.placeholder = lang === "en" ? placeholderEn : placeholderId
    }
  }

  updateLanguageToggle()
}

// Update language toggle button states
function updateLanguageToggle() {
  // Desktop toggle
  const desktopOptions = document.querySelectorAll(".lang-toggle .toggle-option")
  desktopOptions.forEach((option) => {
    const optionLang = option.getAttribute("data-lang")
    if (optionLang === currentLang) {
      option.classList.add("active")
    } else {
      option.classList.remove("active")
    }
  })

  // Mobile toggle - show current language
  const mobileToggle = document.getElementById("langToggleMobile")
  if (mobileToggle) {
    const langText = mobileToggle.querySelector(".lang-text")
    if (langText) {
      langText.textContent = currentLang === "en" ? "US" : "ID"
    }
  }
}

// ============================================
// THEME MANAGEMENT
// ============================================
let currentTheme = localStorage.getItem("theme") || "dark"

// Initialize theme on page load
function initTheme() {
  applyTheme(currentTheme)
  updateThemeToggle()

  // Ensure all text elements have fade-in class initially
  const activePage = document.querySelector('.page.active')
  const textElements = activePage.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span:not(.flag-emoji), li, td, th')
  textElements.forEach((element) => {
    element.classList.add('theme-fade-in')
  })
}

// Apply theme to body with transition animation
function applyTheme(theme) {
  const overlay = document.getElementById("themeTransitionOverlay")
  if (!overlay) {
    console.warn("Theme transition overlay element not found")
    return
  }

  // Get text elements for fade animation
  const activePage = document.querySelector('.page.active')
  const textElements = activePage.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span:not(.flag-emoji), li, td, th')

  // Define icons
  const moonIcon = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>'
  const sunIcon = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>'

  const oldIcon = currentTheme === "light" ? sunIcon : moonIcon
  const newIcon = theme === "light" ? sunIcon : moonIcon

  // Add icon container to overlay
  overlay.innerHTML = `
    <div class="theme-transition-icon">
      <svg class="theme-icon old-theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${oldIcon}
      </svg>
      <svg class="theme-icon new-theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${newIcon}
      </svg>
    </div>
  `

  // Set overlay background to new theme
  const newBgColor = theme === "light" ? "#ffffff" : "#0a0a0a"
  overlay.style.backgroundColor = newBgColor

  // Fade out text elements
  textElements.forEach(el => {
    el.classList.add('theme-fade-out')
    el.classList.remove('theme-fade-in')
  })

  // Start circular expand animation
  overlay.style.visibility = "visible"
  overlay.style.opacity = "1"
  overlay.style.animation = "themeTransitionCircularExpand 0.3s ease-out"

  // Switch theme immediately
  currentTheme = theme
  localStorage.setItem("theme", theme)

  if (theme === "light") {
    document.body.classList.add("light-theme")
  } else {
    document.body.classList.remove("light-theme")
  }

  updateThemeToggle()

  // Animate icon transition
  setTimeout(() => {
    const oldIconEl = overlay.querySelector(".old-theme-icon")
    const newIconEl = overlay.querySelector(".new-theme-icon")
    if (oldIconEl && newIconEl) {
      oldIconEl.style.opacity = "0"
      newIconEl.style.opacity = "1"
    }
  }, 150) // Start icon fade at 0.15s

  // Hide overlay and fade in text after animation
  setTimeout(() => {
    overlay.style.visibility = "hidden"
    overlay.style.opacity = "0"
    overlay.style.animation = ""
    overlay.innerHTML = ""

    // Fade in text elements
    textElements.forEach(el => {
      el.classList.remove('theme-fade-out')
      el.classList.add('theme-fade-in')
    })
  }, 300)
}

// Update theme toggle button states
function updateThemeToggle() {
  // Desktop toggle
  const desktopOptions = document.querySelectorAll(".theme-toggle .toggle-option")
  desktopOptions.forEach((option) => {
    const optionTheme = option.getAttribute("data-theme")
    if (optionTheme === currentTheme) {
      option.classList.add("active")
    } else {
      option.classList.remove("active")
    }
  })

  // Mobile toggle - update icon
  const mobileToggle = document.getElementById("themeToggleMobile")
  if (mobileToggle) {
    const icon = mobileToggle.querySelector(".theme-icon")
    if (icon) {
      if (currentTheme === "light") {
        // Moon icon for light theme
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>'
      } else {
        // Sun icon for dark theme
        icon.innerHTML =
          '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>'
      }
    }
  }
}

// ============================================
// NAVIGATION MANAGEMENT
// ============================================
function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item")
  const pages = document.querySelectorAll(".page")

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()

      const targetPage = item.getAttribute("data-page")

      // Update active nav item
      navItems.forEach((nav) => nav.classList.remove("active"))
      item.classList.add("active")

      // Show target page with fade animation
      pages.forEach((page) => {
        page.classList.remove("active")
        removeTabContentAnimations(page)
        if (page.id === targetPage) {
          setTimeout(() => {
            page.classList.add("active")
            applyTabContentAnimations(page)
            // Apply theme fade-in to new page text elements
            const textElements = page.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span:not(.flag-emoji), li, td, th')
            textElements.forEach((element) => {
              element.classList.add('theme-fade-in')
            })
            // Load GitHub dashboard if dashboard tab
            if (targetPage === 'dashboard') {
              loadGitHubDashboard()
            }
            // Initialize chat room if chat-room tab
            if (targetPage === 'chat-room') {
              initChatRoom()
            }
            // Scroll to top when switching tabs
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            })
          }, 50)
        }
      })

      // Close mobile sidebar if open
      closeMobileSidebar()
    })
  })
}

// Remove tab content animation classes
function removeTabContentAnimations(page) {
  const animatedElements = page.querySelectorAll(".tab-content-animate")
  animatedElements.forEach((el) => {
    el.classList.remove(
      "tab-content-animate",
      "tab-content-animate-delay-1",
      "tab-content-animate-delay-2",
      "tab-content-animate-delay-3",
      "tab-content-animate-delay-4",
      "tab-content-animate-delay-5"
    )
  })
}

// Apply tab content animation classes with staggered delays
function applyTabContentAnimations(page) {
  // Select key content elements to animate
  const elementsToAnimate = []

  // Example: animate page header children and main content direct children
  const pageHeader = page.querySelector(".page-header")
  if (pageHeader) {
    elementsToAnimate.push(...pageHeader.children)
  }

  // Also animate direct children of page except page-header
  Array.from(page.children).forEach((child) => {
    if (child !== pageHeader) {
      elementsToAnimate.push(child)
    }
  })

  // Apply animation classes with staggered delays
  elementsToAnimate.forEach((el, index) => {
    if (index < 5) {
      el.classList.add("tab-content-animate", `tab-content-animate-delay-${index + 1}`)
    } else {
      el.classList.add("tab-content-animate", "tab-content-animate-delay-5")
    }
  })
}

// ============================================
// MOBILE SIDEBAR MANAGEMENT
// ============================================
function initMobileSidebar() {
  const sidebar = document.getElementById("sidebar")
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebarClose = document.getElementById("sidebarClose")

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active")

      // Animate mobile profile fade in/out based on sidebar state
      const mobileProfile = document.querySelector(".mobile-profile")
      if (mobileProfile) {
        mobileProfile.style.opacity = sidebar.classList.contains("active") ? "0" : "1"
      }
    })
  }

  if (sidebarClose) {
    sidebarClose.addEventListener("click", () => {
      closeMobileSidebar()
    })
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        closeMobileSidebar()
      }
    }
  })
}

function closeMobileSidebar() {
  const sidebar = document.getElementById("sidebar")
  sidebar.classList.remove("active")

  // Show mobile profile when sidebar closes
  const mobileProfile = document.querySelector(".mobile-profile")
  if (mobileProfile) {
    mobileProfile.style.opacity = "1"
  }
}

// ============================================
// ACHIEVEMENT SEARCH FUNCTIONALITY
// ============================================
function initAchievementSearch() {
  const searchInput = document.getElementById("achievementSearch")
  const achievementItems = document.querySelectorAll(".achievement-item")
  const emptyState = document.getElementById("emptyState")

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()
      let visibleCount = 0

      achievementItems.forEach((item) => {
        const title = item.getAttribute("data-title").toLowerCase()

        if (title.includes(searchTerm)) {
          item.style.display = "block"
          visibleCount++
        } else {
          item.style.display = "none"
        }
      })

      // Show/hide empty state
      if (visibleCount === 0) {
        emptyState.style.display = "block"
      } else {
        emptyState.style.display = "none"
      }
    })
  }
}

// ============================================
// PROJECT IMAGE CLICK HANDLER
// ============================================
function initProjectLinks() {
  const projectItems = document.querySelectorAll(".project-item")

  projectItems.forEach((item) => {
    const imageWrapper = item.querySelector(".project-image-wrapper")
    const viewButton = item.querySelector(".btn-view")

    if (imageWrapper && viewButton) {
      imageWrapper.addEventListener("click", () => {
        viewButton.click()
      })
    }
  })
}

// ============================================
// TAKE ME HOME BUTTON
// ============================================
function initHomeButton() {
  const btnHome = document.getElementById("btnHome")

  if (btnHome) {
    btnHome.addEventListener("click", () => {
      // Trigger home navigation
      const homeNav = document.querySelector('.nav-item[data-page="home"]')
      if (homeNav) {
        homeNav.click()
      }
    })
  }
}

// ============================================
// MARQUEE ANIMATION SETUP
// ============================================
function initMarquee() {
  const marquees = document.querySelectorAll(".marquee")

  marquees.forEach((marquee) => {
    // Duplicate content for seamless loop
    const content = marquee.innerHTML
    marquee.innerHTML = content + content
  })
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
  // Desktop language toggle
  const langToggleOptions = document.querySelectorAll(".lang-toggle .toggle-option")
  langToggleOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const lang = option.getAttribute("data-lang")
      updateLanguage(lang)
    })
  })

  // Mobile language toggle
  const langToggleMobile = document.getElementById("langToggleMobile")
  if (langToggleMobile) {
    langToggleMobile.addEventListener("click", () => {
      const newLang = currentLang === "en" ? "id" : "en"
      updateLanguage(newLang)
    })
  }

  // Desktop theme toggle
  const themeToggleOptions = document.querySelectorAll(".theme-toggle .toggle-option")
  themeToggleOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const theme = option.getAttribute("data-theme")
      applyTheme(theme)
    })
  })

  // Mobile theme toggle
  const themeToggleMobile = document.getElementById("themeToggleMobile")
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener("click", () => {
      const newTheme = currentTheme === "dark" ? "light" : "dark"
      applyTheme(newTheme)
    })
  }
}

// ============================================
// CHAT ROOM FUNCTIONALITY
// ============================================
let currentUser = null
let chatMessages = []
let unsubscribeMessages = null

// Pinned message constant
const pinnedMessage = {
  id: "pinned",
  username: "Nelsen Chandra",
  avatar: "images/profile/profile-photo.jpg",
  message: "Welcome guys",
  pinned: true,
  timestamp: "2000-01-01T00:00:00.000Z", // Very old timestamp to ensure it appears first
  userId: "system"
}

function initChatRoom() {
  initFirebaseAuth()
  initChatInput()
  initGoogleLoginButton()
  updateLoginStatus()
}

function initFirebaseAuth() {
  if (window.onAuthStateChanged) {
    window.onAuthStateChanged(window.firebaseAuth, (user) => {
      if (user) {
        currentUser = {
          id: user.uid,
          name: user.displayName,
          avatar: user.photoURL,
          email: user.email
        }
        loadChatMessages()
      } else {
        currentUser = null
        if (unsubscribeMessages) {
          unsubscribeMessages()
          unsubscribeMessages = null
        }
        renderAllMessages()
      }
      updateLoginStatus()
    })
  }
}

function initChatRoomButton() {
  const btnChatRoom = document.querySelector(".btn-chat-room")
  if (btnChatRoom) {
    btnChatRoom.addEventListener("click", (e) => {
      e.preventDefault()
      const chatRoomNav = document.querySelector('.nav-item[data-page="chat-room"]')
      if (chatRoomNav) {
        chatRoomNav.click()
      }
    })
  }
}

function initChatInput() {
  const chatInput = document.getElementById("chatInput")
  const sendButton = document.getElementById("sendButton")

  if (chatInput && sendButton) {
    // Send message on button click
    sendButton.addEventListener("click", sendMessage)

    // Send message on Enter key press
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    })

    // Enable/disable send button based on input and login status
    chatInput.addEventListener("input", () => {
      if (currentUser && chatInput.value.trim().length > 0) {
        sendButton.disabled = false
      } else {
        sendButton.disabled = true
      }
    })
  }
}

async function sendMessage() {
  if (!currentUser) {
    showLoginPrompt()
    return
  }

  const chatInput = document.getElementById("chatInput")
  let message = chatInput.value.trim()

  if (message === "") return

  // Limit message to max 300 words (approximate syllables)
  const maxWords = 300
  const words = message.split(/\s+/)
  if (words.length > maxWords) {
    words.length = maxWords
    message = words.join(" ")
    alert(`Message truncated to ${maxWords} words.`)
  }

  try {
    const messageData = {
      username: currentUser.name,
      avatar: currentUser.avatar,
      message: message,
      timestamp: new Date().toISOString(),
      userId: currentUser.id
    }

    // Save to Firestore
    await window.addDoc(window.collection(window.firebaseDb, "messages"), messageData)

    // Clear input
    chatInput.value = ""

    // Disable send button after sending
    document.getElementById("sendButton").disabled = true

    // Scroll to bottom
    scrollToBottom()
  } catch (error) {
    console.error("Error sending message:", error)
    alert("Failed to send message. Please try again.")
  }
}

function renderMessage(message) {
  const chatMessagesContainer = document.getElementById("chatMessages")

  const messageElement = document.createElement("div")
  messageElement.className = "chat-message"
  if (message.pinned) {
    messageElement.classList.add("pinned")
  }
  messageElement.setAttribute("data-message-id", message.id)

  const date = new Date(message.timestamp)
  const formattedDate = date.toLocaleDateString() + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})

  messageElement.innerHTML = `
    <div class="message-avatar">
      <img src="${message.avatar}" alt="${message.username}">
    </div>
    <div class="message-content">
      <div class="message-header">
        <span class="message-username">${message.username}</span>
        <span class="message-date">${formattedDate}</span>
      </div>
      <div class="message-bubble">
        <p>${escapeHtml(message.message)}</p>
        ${message.pinned ? '<span class="pinned-icon" title="Pinned">• pinned</span>' : ''}
      </div>
    </div>
  `

  chatMessagesContainer.appendChild(messageElement)
}

function loadChatMessages() {
  if (!currentUser || !window.firebaseDb) {
    // If not logged in or Firebase not available, show only pinned message
    chatMessages = [pinnedMessage]
    renderAllMessages()
    return
  }

  // Unsubscribe from previous listener if exists
  if (unsubscribeMessages) {
    unsubscribeMessages()
  }

  // Set up real-time listener for messages
  const q = window.query(
    window.collection(window.firebaseDb, "messages"),
    window.orderBy("timestamp", "asc"),
    window.limit(100)
  )

  unsubscribeMessages = window.onSnapshot(q, (querySnapshot) => {
    chatMessages = [pinnedMessage] // Always include pinned message

    querySnapshot.forEach((doc) => {
      const messageData = doc.data()
      chatMessages.push({
        id: doc.id,
        ...messageData
      })
    })

    renderAllMessages()
  }, (error) => {
    console.error("Error loading messages:", error)
    // Fallback to pinned message only
    chatMessages = [pinnedMessage]
    renderAllMessages()
  })
}

function renderAllMessages() {
  const chatMessagesContainer = document.getElementById("chatMessages")
  chatMessagesContainer.innerHTML = ""

  chatMessages.forEach(message => {
    renderMessage(message)
  })

  scrollToBottom()
}

function scrollToBottom() {
  const chatMessagesContainer = document.getElementById("chatMessages")
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight
}

function updateLoginStatus() {
  const loginPrompt = document.getElementById("loginPrompt")
  const sendButton = document.getElementById("sendButton")
  const contactLoginPrompt = document.querySelector(".login-prompt-contact")

  if (currentUser) {
    loginPrompt.style.display = "none"
    sendButton.disabled = false

    // Update contact section to show user info
    if (contactLoginPrompt) {
      contactLoginPrompt.innerHTML = `
        <div class="user-info-contact">
          <img src="${currentUser.avatar}" alt="${currentUser.name}" class="user-avatar-contact">
          <div class="user-details-contact">
            <p>Logged in as <strong>${currentUser.name}</strong></p>
            <button class="btn-logout" onclick="performGoogleLogout()">Logout</button>
          </div>
        </div>
      `
    }
  } else {
    loginPrompt.style.display = "block"
    sendButton.disabled = true

    // Reset contact section to login prompt
    if (contactLoginPrompt) {
      contactLoginPrompt.innerHTML = `
        <p>Please login to access the chat room</p>
        <button class="btn-google-login-contact" aria-label="Login with Google">
          <svg class="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" width="18" height="18" aria-hidden="true" focusable="false">
            <path fill="#4285F4" d="M533.5 278.4c0-18.5-1.5-36.3-4.3-53.6H272v101.3h146.9c-6.3 34-25.4 62.8-54.3 82v68h87.7c51.3-47.3 81.2-116.7 81.2-197.7z"/>
            <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.4 180.8-66.1l-87.7-68c-24.4 16.3-55.7 25.9-93.1 25.9-71.5 0-132-48.3-153.5-113.1H29.6v70.9C74.6 485.7 167.6 544.3 272 544.3z"/>
            <path fill="#FBBC05" d="M118.5 323.9c-5.4-16.3-8.5-33.7-8.5-51.5s3.1-35.2 8.5-51.5v-70.9H29.6c-17.8 35.7-28 75.7-28 122.4s10.2 86.7 28 122.4l88.9-70.9z"/>
            <path fill="#EA4335" d="M272 107.7c39.9 0 75.7 13.7 103.9 40.7l77.9-77.9C405.7 24.4 343.8 0 272 0 167.6 0 74.6 58.6 29.6 146.8l88.9 70.9c21.5-64.8 82-113.1 153.5-113.1z"/>
          </svg>
          Login with Google
        </button>
      `
      // Re-attach event listener
      const newLoginButton = contactLoginPrompt.querySelector(".btn-google-login-contact")
      if (newLoginButton) {
        newLoginButton.addEventListener("click", () => {
          performGoogleLogin()
        })
      }
    }
  }
}

function showLoginPrompt() {
  // Trigger Google login
  performGoogleLogin()
}

async function performGoogleLogin() {
  if (!window.signInWithPopup || !window.firebaseAuth || !window.firebaseProvider) {
    alert("Firebase not initialized. Please check your Firebase configuration.")
    return
  }

  try {
    const result = await window.signInWithPopup(window.firebaseAuth, window.firebaseProvider)
    // User will be set by the auth state listener
    console.log("User signed in:", result.user.displayName)
  } catch (error) {
    console.error("Error signing in:", error)
    alert("Failed to sign in with Google. Please try again.")
  }
}

async function performGoogleLogout() {
  if (!window.signOut || !window.firebaseAuth) {
    return
  }

  try {
    await window.signOut(window.firebaseAuth)
    console.log("User signed out")
  } catch (error) {
    console.error("Error signing out:", error)
  }
}

function initGoogleLoginButton() {
  const googleLoginButton = document.getElementById("googleLoginButton")
  if (googleLoginButton) {
    googleLoginButton.addEventListener("click", () => {
      performGoogleLogin()
    })
  }

  // Also handle login buttons in contact section
  const contactLoginButton = document.querySelector(".btn-google-login-contact")
  if (contactLoginButton) {
    contactLoginButton.addEventListener("click", () => {
      performGoogleLogin()
    })
  }
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// ============================================

// ============================================
// GITHUB CONTRIBUTIONS DASHBOARD
// ============================================
function renderContributionCalendar(contributionCalendar) {
  const calendarGrid = document.getElementById('calendarGrid');
  calendarGrid.innerHTML = '';

  const weeks = contributionCalendar.weeks;

  // Create 7 rows x 53 columns grid
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 53; col++) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'day';

      // Find the corresponding day in the data
      if (weeks[col] && weeks[col].contributionDays[row]) {
        const day = weeks[col].contributionDays[row];
        const count = day.contributionCount;

        // Determine level based on count
        let level = 0;
        if (count > 0) {
          if (count <= 1) level = 1;
          else if (count <= 3) level = 2;
          else if (count <= 6) level = 3;
          else level = 4;
        }

        if (level > 0) {
          dayDiv.classList.add(`level-${level}`);
        }
      }

      calendarGrid.appendChild(dayDiv);
    }
  }
}

function updateStatsDisplay(stats) {
  document.getElementById('totalContributions').textContent = stats.totalContributions;
  document.getElementById('currentStreak').textContent = `${stats.currentStreak} days`;
  document.getElementById('longestStreak').textContent = `${stats.longestStreak} days`;
  document.getElementById('yearContributions').textContent = stats.yearContributions;
}

function renderGitHubUserProfile(user) {
  document.getElementById('profileAvatar').src = user.avatarUrl;
  document.getElementById('profileName').textContent = user.name || 'No name provided';
  document.getElementById('profileBio').textContent = user.bio || 'No bio available';
  document.getElementById('profileLocation').textContent = user.location || '';
  document.getElementById('profileCompany').textContent = user.company || '';
  document.getElementById('followersCount').textContent = user.followers.totalCount;
  document.getElementById('followingCount').textContent = user.following.totalCount;
  document.getElementById('reposCount').textContent = user.repositories.totalCount;
}

async function loadGitHubDashboard() {
  try {
    const response = await fetch('/api/github');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();

    renderContributionCalendar(data.contributionCalendar);
    updateStatsDisplay(data.stats);
    renderGitHubUserProfile(data.userProfile);
  } catch (error) {
    console.error('Error loading GitHub dashboard:', error);
    let errorMessage = 'Error memuat dashboard GitHub';

    if (error.message.includes('500')) {
      errorMessage = 'Server error. Periksa konfigurasi token GitHub di Vercel.';
    } else if (error.message.includes('404')) {
      errorMessage = 'API route tidak ditemukan.';
    }

    // Show error in UI
    document.getElementById('calendarGrid').innerHTML = `<p>${errorMessage}</p>`;
    document.getElementById('profileName').textContent = 'Error memuat profil';
    document.getElementById('profileBio').textContent = errorMessage;
  }
}

// ============================================
// INITIALIZATION
// ============================================
function initOfficialWebButton() {
  const btnOfficial = document.querySelector(".btn-official")
  if (btnOfficial) {
    btnOfficial.addEventListener("click", (e) => {
      e.preventDefault()
      const officialNav = document.querySelector('.nav-item[data-page="official"]')
      if (officialNav) {
        officialNav.click()
      }
    })
  }
}

// New function: Initialize scroll sliding fade animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".featured-card, .skill-item, .achievement-item, .project-item, .contact-card, .about-content p, .page-header, .page-title, .page-subtitle, .intro-text"
  )

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target

        // Apply different animation classes based on element type or position
        if (el.classList.contains("featured-card") || el.classList.contains("project-item") || el.classList.contains("achievement-item") || el.classList.contains("contact-card")) {
          el.classList.add("scroll-fade-up")
        } else if (el.classList.contains("skill-item")) {
          // Alternate left and right slide for skill items
          const index = Array.from(el.parentNode.children).indexOf(el)
          if (index % 2 === 0) {
            el.classList.add("scroll-slide-left")
          } else {
            el.classList.add("scroll-slide-right")
          }
        } else if (el.tagName === "P" && el.parentNode.classList.contains("about-content")) {
          el.classList.add("scroll-fade-up")
        } else if (el.classList.contains("page-header") || el.classList.contains("page-title") || el.classList.contains("page-subtitle") || el.classList.contains("intro-text")) {
          el.classList.add("scroll-fade-up")
        }

        // Add staggered delay based on index in container
        const container = el.parentNode
        const siblings = Array.from(container.children).filter(child => Array.from(animatedElements).includes(child))
        const index = siblings.indexOf(el)
        const delay = index * 0.2 // 0.2s delay between each element
        el.style.animationDelay = `${delay}s`

        observer.unobserve(el)
      }
    })
  }, observerOptions)

  animatedElements.forEach((el) => {
    observer.observe(el)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] Portfolio website initialized")

  // Scroll to top on page load/refresh
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })

  // Initialize all features
  initLanguage()
  initTheme()
  initNavigation()
  initMobileSidebar()
  initAchievementSearch()
  initProjectLinks()
  initHomeButton()
  initOfficialWebButton()
  initChatRoomButton()
  initMarquee()
  initEventListeners()
  initScrollAnimations()

  // Apply initial tab animations to the default active page (home)
  const activePage = document.querySelector(".page.active")
  if (activePage) {
    setTimeout(() => {
      applyTabContentAnimations(activePage)
    }, 100)
  }

  console.log("[v0] All features loaded successfully")
})

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Smooth scroll to top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
