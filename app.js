// Sports Scheduler Application - Complete Frontend Implementation
// Fixed version with proper event handling and modal management

class SportsScheduler {
    constructor() {
        // Initialize application state
        this.currentUser = null;
        this.currentView = 'dashboard';
        this.sessionToCancel = null;
        
        // Initialize data storage (simulating database)
        this.initializeData();
        
        // Wait for DOM to be ready, then initialize
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        // Bind event listeners
        this.initializeEventListeners();
        
        // Start application
        this.checkAuthState();
    }

    // Initialize sample data from provided JSON
    initializeData() {
        this.users = [
            {
                id: 1,
                name: "Admin User",
                email: "admin@sports.com",
                password: "admin123",
                role: "admin",
                createdAt: "2025-08-01T10:00:00Z"
            },
            {
                id: 2,
                name: "Sports Manager",
                email: "manager@sports.com", 
                password: "manager123",
                role: "admin",
                createdAt: "2025-08-02T10:00:00Z"
            },
            {
                id: 3,
                name: "John Player",
                email: "john@player.com",
                password: "player123", 
                role: "player",
                createdAt: "2025-08-03T10:00:00Z"
            },
            {
                id: 4,
                name: "Sarah Wilson",
                email: "sarah@player.com",
                password: "player123",
                role: "player", 
                createdAt: "2025-08-04T10:00:00Z"
            },
            {
                id: 5,
                name: "Mike Johnson",
                email: "mike@player.com",
                password: "player123",
                role: "player",
                createdAt: "2025-08-05T10:00:00Z"
            }
        ];

        this.sports = [
            {
                id: 1,
                name: "Football",
                description: "11v11 football matches on full-size pitches",
                createdBy: 1,
                createdAt: "2025-08-01T10:00:00Z"
            },
            {
                id: 2, 
                name: "Basketball",
                description: "5v5 basketball games on indoor/outdoor courts",
                createdBy: 1,
                createdAt: "2025-08-01T11:00:00Z"
            },
            {
                id: 3,
                name: "Tennis",
                description: "Singles and doubles tennis matches",
                createdBy: 2,
                createdAt: "2025-08-02T10:00:00Z"
            },
            {
                id: 4,
                name: "Volleyball",
                description: "6v6 volleyball matches on sand or court",
                createdBy: 2,
                createdAt: "2025-08-02T11:00:00Z"
            },
            {
                id: 5,
                name: "Badminton", 
                description: "Singles and doubles badminton games",
                createdBy: 1,
                createdAt: "2025-08-01T12:00:00Z"
            }
        ];

        this.sessions = [
            {
                id: 1,
                sportId: 1,
                createdBy: 3,
                players: {
                    teamA: ["John Player", "Mike Johnson"],
                    teamB: ["Sarah Wilson", "Tom Brown"]
                },
                additionalPlayersNeeded: 14,
                date: "2025-08-20",
                time: "18:00",
                venue: "Central Sports Ground",
                status: "active",
                cancelReason: null,
                joinedPlayers: [],
                createdAt: "2025-08-10T10:00:00Z"
            },
            {
                id: 2,
                sportId: 2, 
                createdBy: 4,
                players: {
                    teamA: ["Sarah Wilson", "Alex Chen"],
                    teamB: ["David Lee"]
                },
                additionalPlayersNeeded: 7,
                date: "2025-08-18",
                time: "19:00", 
                venue: "Community Basketball Court",
                status: "active",
                cancelReason: null,
                joinedPlayers: [{id: 5, name: "Mike Johnson"}],
                createdAt: "2025-08-11T10:00:00Z"
            },
            {
                id: 3,
                sportId: 3,
                createdBy: 5,
                players: {
                    teamA: ["Mike Johnson"],
                    teamB: []
                },
                additionalPlayersNeeded: 1,
                date: "2025-08-17",
                time: "16:00",
                venue: "Tennis Club Court 1", 
                status: "active",
                cancelReason: null,
                joinedPlayers: [],
                createdAt: "2025-08-12T10:00:00Z"
            },
            {
                id: 4,
                sportId: 1,
                createdBy: 3,
                players: {
                    teamA: ["John Player", "Mark Wilson"],
                    teamB: ["Steve Jones", "Paul Smith"]
                },
                additionalPlayersNeeded: 0,
                date: "2025-08-10",
                time: "17:00",
                venue: "Park Football Field",
                status: "cancelled",
                cancelReason: "Weather conditions - heavy rain expected",
                joinedPlayers: [],
                createdAt: "2025-08-08T10:00:00Z"
            },
            {
                id: 5,
                sportId: 4,
                createdBy: 4,
                players: {
                    teamA: ["Sarah Wilson", "Emma Davis", "Lisa Brown"],
                    teamB: ["Anna Jones", "Kate Smith"]
                },
                additionalPlayersNeeded: 7,
                date: "2025-08-22",
                time: "20:00",
                venue: "Beach Volleyball Court",
                status: "active", 
                cancelReason: null,
                joinedPlayers: [{id: 3, name: "John Player"}],
                createdAt: "2025-08-13T10:00:00Z"
            },
            {
                id: 6,
                sportId: 5,
                createdBy: 1,
                players: {
                    teamA: ["Admin User"],
                    teamB: []
                },
                additionalPlayersNeeded: 1,
                date: "2025-08-19", 
                time: "18:30",
                venue: "Sports Center Court 2",
                status: "active",
                cancelReason: null,
                joinedPlayers: [],
                createdAt: "2025-08-14T10:00:00Z"
            }
        ];
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Authentication form listeners
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const showSignupBtn = document.getElementById('show-signup');
        const showLoginBtn = document.getElementById('show-login');

        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        if (signupForm) signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        if (showSignupBtn) showSignupBtn.addEventListener('click', (e) => this.showSignupForm(e));
        if (showLoginBtn) showLoginBtn.addEventListener('click', (e) => this.showLoginForm(e));

        // Navigation listeners
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.getAttribute('data-view');
                if (view) {
                    this.showView(view);
                }
            });
        });

        // Modal listeners
        const addSportBtn = document.getElementById('add-sport-btn');
        const sportForm = document.getElementById('sport-form');
        if (addSportBtn) addSportBtn.addEventListener('click', () => this.showModal('sport-modal'));
        if (sportForm) sportForm.addEventListener('submit', (e) => this.handleCreateSport(e));

        // Session form listeners
        const createSessionForm = document.getElementById('create-session-form');
        const cancelForm = document.getElementById('cancel-form');
        if (createSessionForm) createSessionForm.addEventListener('submit', (e) => this.handleCreateSession(e));
        if (cancelForm) cancelForm.addEventListener('submit', (e) => this.handleCancelSession(e));

        // Profile form listener
        const changePasswordForm = document.getElementById('change-password-form');
        if (changePasswordForm) changePasswordForm.addEventListener('submit', (e) => this.handlePasswordChange(e));

        // Report generation
        const generateReportBtn = document.getElementById('generate-report-btn');
        if (generateReportBtn) generateReportBtn.addEventListener('click', () => this.generateReports());

        // Filter listeners
        const sportFilter = document.getElementById('sport-filter');
        const dateFilter = document.getElementById('date-filter');
        if (sportFilter) sportFilter.addEventListener('change', () => this.renderSessions());
        if (dateFilter) dateFilter.addEventListener('change', () => this.renderSessions());

        // Modal close button listeners
        document.querySelectorAll('.modal-close').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Modal backdrop click listeners
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Escape key listener for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal:not(.hidden)');
                if (openModal) {
                    this.closeModal(openModal.id);
                }
            }
        });

        // Add specific button listeners for cancel modal
        const cancelModalKeepBtn = document.querySelector('#cancel-modal .btn--outline');
        if (cancelModalKeepBtn) {
            cancelModalKeepBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal('cancel-modal');
            });
        }

        const sportModalCancelBtn = document.querySelector('#sport-modal .btn--outline');
        if (sportModalCancelBtn) {
            sportModalCancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal('sport-modal');
            });
        }
    }

    // Check if user is already authenticated
    checkAuthState() {
        // In a real app, check session/JWT token
        // For demo, always show login first
        this.showAuthView();
    }

    // Authentication Methods
    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.showToast('Login successful!', 'success');
            this.showMainApp();
        } else {
            this.showToast('Invalid email or password', 'error');
        }
    }

    handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const role = document.getElementById('signup-role').value;

        // Check if email already exists
        if (this.users.find(u => u.email === email)) {
            this.showToast('Email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: this.users.length + 1,
            name,
            email,
            password,
            role,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.showToast('Account created successfully!', 'success');
        this.showLoginForm();
    }

    logout() {
        this.currentUser = null;
        // Close any open modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        this.showAuthView();
        this.showToast('Logged out successfully', 'success');
    }

    // UI Control Methods
    showAuthView() {
        document.getElementById('auth-view').classList.remove('hidden');
        document.getElementById('app').classList.add('hidden');
    }

    showMainApp() {
        document.getElementById('auth-view').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        
        // Update user name in header
        document.getElementById('user-name').textContent = this.currentUser.name;
        
        // Show/hide admin-only navigation items
        const isAdmin = this.currentUser.role === 'admin';
        document.getElementById('sports-nav').classList.toggle('hidden', !isAdmin);
        document.getElementById('reports-nav').classList.toggle('hidden', !isAdmin);
        
        // Load initial view
        this.showView('dashboard');
    }

    showSignupForm(e) {
        e?.preventDefault();
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('signup-form').classList.remove('hidden');
    }

    showLoginForm(e) {
        e?.preventDefault();
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    }

    // Navigation Methods
    showView(viewName) {
        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`[data-view="${viewName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Hide all views
        document.querySelectorAll('.content-view').forEach(view => {
            view.classList.add('hidden');
        });

        // Show selected view
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.remove('hidden');
        }

        // Load view-specific content
        this.currentView = viewName;
        this.loadViewContent(viewName);
    }

    loadViewContent(viewName) {
        switch (viewName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'sports':
                this.renderSports();
                break;
            case 'sessions':
                this.renderSessions();
                this.populateSportFilter();
                break;
            case 'create-session':
                this.populateSessionSports();
                this.setMinDate();
                break;
            case 'my-sessions':
                this.renderMySessions();
                break;
            case 'reports':
                this.initializeReports();
                break;
            case 'profile':
                this.renderProfile();
                break;
        }
    }

    // Dashboard Methods
    renderDashboard() {
        const isAdmin = this.currentUser.role === 'admin';
        const subtitle = document.getElementById('dashboard-subtitle');
        subtitle.textContent = isAdmin ? 'Admin Dashboard - Manage your sports community' : 'Player Dashboard - Join and create sessions';

        this.renderDashboardStats();
        this.renderDashboardContent();
    }

    renderDashboardStats() {
        const isAdmin = this.currentUser.role === 'admin';
        const statsContainer = document.getElementById('dashboard-stats');

        let stats = [];

        if (isAdmin) {
            const totalSessions = this.sessions.length;
            const activeSessions = this.sessions.filter(s => s.status === 'active').length;
            const totalSports = this.sports.length;
            const totalUsers = this.users.filter(u => u.role === 'player').length;

            stats = [
                { label: 'Total Sessions', value: totalSessions, type: 'info' },
                { label: 'Active Sessions', value: activeSessions, type: 'success' },
                { label: 'Sports Available', value: totalSports, type: 'info' },
                { label: 'Players Registered', value: totalUsers, type: 'success' }
            ];
        } else {
            const mySessions = this.sessions.filter(s => s.createdBy === this.currentUser.id).length;
            const joinedSessions = this.sessions.filter(s => 
                s.joinedPlayers.some(p => p.id === this.currentUser.id)
            ).length;
            const availableSessions = this.sessions.filter(s => 
                s.status === 'active' && 
                s.additionalPlayersNeeded > 0 && 
                new Date(`${s.date}T${s.time}`) > new Date()
            ).length;

            stats = [
                { label: 'My Sessions', value: mySessions, type: 'info' },
                { label: 'Sessions Joined', value: joinedSessions, type: 'success' },
                { label: 'Available to Join', value: availableSessions, type: 'warning' }
            ];
        }

        statsContainer.innerHTML = stats.map(stat => `
            <div class="stat-card ${stat.type}">
                <div class="stat-value">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
    }

    renderDashboardContent() {
        const isAdmin = this.currentUser.role === 'admin';
        const contentContainer = document.getElementById('dashboard-content');

        if (isAdmin) {
            // Show recent sessions and quick actions for admin
            const recentSessions = this.sessions
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 3);

            contentContainer.innerHTML = `
                <div class="dashboard-section">
                    <h3>Recent Sessions</h3>
                    <div class="items-grid">
                        ${recentSessions.map(session => this.renderSessionCard(session)).join('')}
                    </div>
                </div>
            `;
        } else {
            // Show available sessions for players
            const availableSessions = this.sessions.filter(s => 
                s.status === 'active' && 
                s.additionalPlayersNeeded > 0 && 
                new Date(`${s.date}T${s.time}`) > new Date() &&
                !s.joinedPlayers.some(p => p.id === this.currentUser.id)
            ).slice(0, 3);

            contentContainer.innerHTML = `
                <div class="dashboard-section">
                    <h3>Available Sessions</h3>
                    <div class="items-grid">
                        ${availableSessions.map(session => this.renderSessionCard(session)).join('')}
                    </div>
                </div>
            `;
        }
    }

    // Sports Management Methods (Admin Only)
    renderSports() {
        const sportsList = document.getElementById('sports-list');
        const userSports = this.sports.filter(sport => sport.createdBy === this.currentUser.id);

        sportsList.innerHTML = userSports.map(sport => `
            <div class="item-card">
                <div class="item-header">
                    <h3 class="item-title">${sport.name}</h3>
                </div>
                <div class="item-meta">
                    <p>${sport.description || 'No description provided'}</p>
                    <div class="meta-item">
                        <span>📅</span>
                        <span>Created: ${new Date(sport.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    handleCreateSport(e) {
        e.preventDefault();
        
        const name = document.getElementById('sport-name').value;
        const description = document.getElementById('sport-description').value;

        const newSport = {
            id: this.sports.length + 1,
            name,
            description,
            createdBy: this.currentUser.id,
            createdAt: new Date().toISOString()
        };

        this.sports.push(newSport);
        this.showToast('Sport created successfully!', 'success');
        this.closeModal('sport-modal');
        
        if (this.currentView === 'sports') {
            this.renderSports();
        }

        // Reset form
        document.getElementById('sport-form').reset();
    }

    // Session Management Methods
    renderSessions() {
        const sessionsList = document.getElementById('sessions-list');
        const sportFilter = document.getElementById('sport-filter');
        const dateFilter = document.getElementById('date-filter');
        
        const sportFilterValue = sportFilter ? sportFilter.value : '';
        const dateFilterValue = dateFilter ? dateFilter.value : '';

        let filteredSessions = this.sessions.filter(session => {
            // Only show active sessions that haven't passed
            if (session.status !== 'active') return false;
            
            const sessionDateTime = new Date(`${session.date}T${session.time}`);
            if (sessionDateTime <= new Date()) return false;

            // Apply filters
            if (sportFilterValue && session.sportId !== parseInt(sportFilterValue)) return false;
            if (dateFilterValue && session.date !== dateFilterValue) return false;

            return true;
        });

        sessionsList.innerHTML = filteredSessions.map(session => 
            this.renderSessionCard(session)
        ).join('');
    }

    renderSessionCard(session) {
        const sport = this.sports.find(s => s.id === session.sportId);
        const creator = this.users.find(u => u.id === session.createdBy);
        const isCreator = session.createdBy === this.currentUser.id;
        const hasJoined = session.joinedPlayers.some(p => p.id === this.currentUser.id);
        const isFull = session.additionalPlayersNeeded <= session.joinedPlayers.length;
        const isPastSession = new Date(`${session.date}T${session.time}`) <= new Date();
        const hasTimeConflict = this.hasTimeConflict(session.date, session.time, session.id);

        let statusClass = 'active';
        let statusText = 'Active';

        if (session.status === 'cancelled') {
            statusClass = 'cancelled';
            statusText = 'Cancelled';
        } else if (isFull) {
            statusClass = 'full';
            statusText = 'Full';
        }

        const actionButtons = [];

        if (session.status === 'active' && !isPastSession) {
            if (isCreator) {
                actionButtons.push(`
                    <button class="btn btn--outline btn--sm" onclick="window.sportsApp.cancelSession(${session.id})">
                        Cancel Session
                    </button>
                `);
            } else if (!hasJoined && !isFull && !hasTimeConflict) {
                actionButtons.push(`
                    <button class="btn btn--primary btn--sm" onclick="window.sportsApp.joinSession(${session.id})">
                        Join Session
                    </button>
                `);
            } else if (hasJoined) {
                actionButtons.push(`
                    <span class="status status--success">Joined</span>
                `);
            } else if (hasTimeConflict) {
                actionButtons.push(`
                    <span class="status status--warning">Time Conflict</span>
                `);
            }
        }

        return `
            <div class="item-card ${session.status === 'cancelled' ? 'cancelled' : ''}">
                <div class="item-header">
                    <h3 class="item-title">${sport?.name || 'Unknown Sport'}</h3>
                    <span class="session-status ${statusClass}">${statusText}</span>
                </div>
                <div class="item-meta">
                    <div class="meta-item">
                        <span>📅</span>
                        <span>${new Date(session.date).toLocaleDateString()} at ${session.time}</span>
                    </div>
                    <div class="meta-item">
                        <span>📍</span>
                        <span>${session.venue}</span>
                    </div>
                    <div class="meta-item">
                        <span>👤</span>
                        <span>Created by ${creator?.name || 'Unknown'}</span>
                    </div>
                    <div class="meta-item">
                        <span>👥</span>
                        <span>${session.joinedPlayers.length}/${session.additionalPlayersNeeded} additional players joined</span>
                    </div>
                </div>
                ${this.renderTeamPlayers(session.players)}
                ${session.status === 'cancelled' && session.cancelReason ? `
                    <div class="cancel-reason">
                        <strong>Cancellation Reason:</strong>
                        <p>${session.cancelReason}</p>
                    </div>
                ` : ''}
                <div class="item-actions">
                    ${actionButtons.join('')}
                </div>
            </div>
        `;
    }

    renderTeamPlayers(players) {
        return `
            <div class="team-players-display">
                <div class="team-display">
                    <h5>Team A</h5>
                    <ul class="player-list">
                        ${players.teamA.map(player => `<li>${player}</li>`).join('') || '<li>No players</li>'}
                    </ul>
                </div>
                <div class="team-display">
                    <h5>Team B</h5>
                    <ul class="player-list">
                        ${players.teamB.map(player => `<li>${player}</li>`).join('') || '<li>No players</li>'}
                    </ul>
                </div>
            </div>
        `;
    }

    populateSportFilter() {
        const sportFilter = document.getElementById('sport-filter');
        if (sportFilter) {
            sportFilter.innerHTML = '<option value="">All Sports</option>' + 
                this.sports.map(sport => `<option value="${sport.id}">${sport.name}</option>`).join('');
        }
    }

    populateSessionSports() {
        const sportSelect = document.getElementById('session-sport');
        if (sportSelect) {
            sportSelect.innerHTML = '<option value="">Select a sport</option>' + 
                this.sports.map(sport => `<option value="${sport.id}">${sport.name}</option>`).join('');
        }
    }

    setMinDate() {
        const dateInput = document.getElementById('session-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
    }

    handleCreateSession(e) {
        e.preventDefault();

        const sportId = parseInt(document.getElementById('session-sport').value);
        const date = document.getElementById('session-date').value;
        const time = document.getElementById('session-time').value;
        const venue = document.getElementById('session-venue').value;
        const additionalPlayers = parseInt(document.getElementById('additional-players').value);

        // Check for time conflicts
        if (this.hasTimeConflict(date, time)) {
            this.showToast('You already have a session at this time', 'error');
            return;
        }

        // Collect team players
        const teamAInputs = document.querySelectorAll('#team-a-players .player-input');
        const teamBInputs = document.querySelectorAll('#team-b-players .player-input');

        const teamA = Array.from(teamAInputs)
            .map(input => input.value.trim())
            .filter(name => name);

        const teamB = Array.from(teamBInputs)
            .map(input => input.value.trim())
            .filter(name => name);

        const newSession = {
            id: this.sessions.length + 1,
            sportId,
            createdBy: this.currentUser.id,
            players: { teamA, teamB },
            additionalPlayersNeeded: additionalPlayers,
            date,
            time,
            venue,
            status: 'active',
            cancelReason: null,
            joinedPlayers: [],
            createdAt: new Date().toISOString()
        };

        this.sessions.push(newSession);
        this.showToast('Session created successfully!', 'success');
        
        // Reset form
        document.getElementById('create-session-form').reset();
        this.resetTeamPlayers();
        
        // Navigate to sessions view
        this.showView('sessions');
    }

    hasTimeConflict(date, time, excludeSessionId = null) {
        return this.sessions.some(session => {
            if (excludeSessionId && session.id === excludeSessionId) return false;
            if (session.status !== 'active') return false;
            
            const isCreator = session.createdBy === this.currentUser.id;
            const hasJoined = session.joinedPlayers.some(p => p.id === this.currentUser.id);
            
            return (isCreator || hasJoined) && session.date === date && session.time === time;
        });
    }

    joinSession(sessionId) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (!session || session.joinedPlayers.some(p => p.id === this.currentUser.id)) {
            this.showToast('Unable to join session', 'error');
            return;
        }

        if (this.hasTimeConflict(session.date, session.time)) {
            this.showToast('You have a time conflict with another session', 'error');
            return;
        }

        session.joinedPlayers.push({
            id: this.currentUser.id,
            name: this.currentUser.name
        });

        this.showToast('Successfully joined the session!', 'success');
        this.loadViewContent(this.currentView);
    }

    cancelSession(sessionId) {
        this.sessionToCancel = sessionId;
        this.showModal('cancel-modal');
    }

    handleCancelSession(e) {
        e.preventDefault();
        
        const reason = document.getElementById('cancel-reason').value;
        const session = this.sessions.find(s => s.id === this.sessionToCancel);
        
        if (session) {
            session.status = 'cancelled';
            session.cancelReason = reason;
            
            this.showToast('Session cancelled successfully', 'success');
            this.closeModal('cancel-modal');
            
            // Refresh current view
            this.loadViewContent(this.currentView);
        }

        // Reset form
        document.getElementById('cancel-form').reset();
        this.sessionToCancel = null;
    }

    renderMySessions() {
        const mySessionsList = document.getElementById('my-sessions-list');
        const mySessions = this.sessions.filter(session => session.createdBy === this.currentUser.id);

        mySessionsList.innerHTML = mySessions.map(session => 
            this.renderSessionCard(session)
        ).join('');
    }

    // Reports Methods (Admin Only)
    initializeReports() {
        // Set default date range to last 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const reportEndDate = document.getElementById('report-end-date');
        const reportStartDate = document.getElementById('report-start-date');
        
        if (reportEndDate) reportEndDate.value = endDate.toISOString().split('T')[0];
        if (reportStartDate) reportStartDate.value = startDate.toISOString().split('T')[0];
    }

    generateReports() {
        const startDate = document.getElementById('report-start-date').value;
        const endDate = document.getElementById('report-end-date').value;

        if (!startDate || !endDate) {
            this.showToast('Please select both start and end dates', 'error');
            return;
        }

        const filteredSessions = this.sessions.filter(session => {
            const sessionDate = session.date;
            return sessionDate >= startDate && sessionDate <= endDate;
        });

        this.renderReportResults(filteredSessions, startDate, endDate);
    }

    renderReportResults(sessions, startDate, endDate) {
        const resultsContainer = document.getElementById('report-results');
        
        // Calculate statistics
        const totalSessions = sessions.length;
        const activeSessions = sessions.filter(s => s.status === 'active').length;
        const cancelledSessions = sessions.filter(s => s.status === 'cancelled').length;

        // Sport popularity
        const sportStats = this.sports.map(sport => {
            const sportSessions = sessions.filter(s => s.sportId === sport.id);
            return {
                name: sport.name,
                sessions: sportSessions.length,
                active: sportSessions.filter(s => s.status === 'active').length
            };
        }).sort((a, b) => b.sessions - a.sessions);

        // User engagement
        const userStats = this.users.filter(u => u.role === 'player').map(user => {
            const createdSessions = sessions.filter(s => s.createdBy === user.id).length;
            const joinedSessions = sessions.filter(s => 
                s.joinedPlayers.some(p => p.id === user.id)
            ).length;
            
            return {
                name: user.name,
                created: createdSessions,
                joined: joinedSessions,
                total: createdSessions + joinedSessions
            };
        }).sort((a, b) => b.total - a.total);

        resultsContainer.innerHTML = `
            <div class="report-section">
                <h3>Session Statistics</h3>
                <p>Report Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}</p>
                <div class="stats-grid">
                    <div class="stat-card info">
                        <div class="stat-value">${totalSessions}</div>
                        <div class="stat-label">Total Sessions</div>
                    </div>
                    <div class="stat-card success">
                        <div class="stat-value">${activeSessions}</div>
                        <div class="stat-label">Active Sessions</div>
                    </div>
                    <div class="stat-card warning">
                        <div class="stat-value">${cancelledSessions}</div>
                        <div class="stat-label">Cancelled Sessions</div>
                    </div>
                </div>
            </div>

            <div class="report-section">
                <h3>Sport Popularity</h3>
                <div class="report-grid">
                    ${sportStats.map(sport => `
                        <div class="item-card">
                            <h4>${sport.name}</h4>
                            <div class="meta-item">
                                <span>Total Sessions: ${sport.sessions}</span>
                            </div>
                            <div class="meta-item">
                                <span>Active: ${sport.active}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="report-section">
                <h3>User Engagement</h3>
                <div class="report-grid">
                    ${userStats.slice(0, 10).map(user => `
                        <div class="item-card">
                            <h4>${user.name}</h4>
                            <div class="meta-item">
                                <span>Created: ${user.created}</span>
                            </div>
                            <div class="meta-item">
                                <span>Joined: ${user.joined}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Total: ${user.total}</strong>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Profile Methods
    renderProfile() {
        const profileInfo = document.getElementById('profile-info');
        
        profileInfo.innerHTML = `
            <div class="info-item">
                <span class="info-label">Name</span>
                <span class="info-value">${this.currentUser.name}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">${this.currentUser.email}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Role</span>
                <span class="info-value">${this.currentUser.role}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Member Since</span>
                <span class="info-value">${new Date(this.currentUser.createdAt).toLocaleDateString()}</span>
            </div>
        `;
    }

    handlePasswordChange(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (currentPassword !== this.currentUser.password) {
            this.showToast('Current password is incorrect', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showToast('New passwords do not match', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showToast('Password must be at least 6 characters long', 'error');
            return;
        }

        // Update password
        this.currentUser.password = newPassword;
        this.users.find(u => u.id === this.currentUser.id).password = newPassword;

        this.showToast('Password updated successfully!', 'success');
        document.getElementById('change-password-form').reset();
    }

    // Utility Methods
    resetTeamPlayers() {
        const teamAContainer = document.getElementById('team-a-players');
        const teamBContainer = document.getElementById('team-b-players');
        
        if (teamAContainer) {
            teamAContainer.innerHTML = '<input type="text" class="form-control player-input" placeholder="Player name">';
        }
        if (teamBContainer) {
            teamBContainer.innerHTML = '<input type="text" class="form-control player-input" placeholder="Player name">';
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `toast ${type}`;
            toast.classList.remove('hidden');

            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }
    }

    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.remove('hidden');
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }
}

// Team player management functions (global scope for onclick handlers)
function addPlayer(teamId) {
    const container = document.getElementById(`${teamId}-players`);
    if (container) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control player-input';
        input.placeholder = 'Player name';
        container.appendChild(input);
    }
}

// Initialize application when DOM is loaded
let sportsApp;
document.addEventListener('DOMContentLoaded', () => {
    sportsApp = new SportsScheduler();
    // Make app globally accessible for onclick handlers
    window.sportsApp = sportsApp;
    sportsApp.hideLoading();
});