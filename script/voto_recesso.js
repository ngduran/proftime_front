// State
const MOCK_USERS = [
    { id: '1', name: 'Prof. Sandra', network: 'Rede Estadual' },
    { id: '2', name: 'Prof. Carlos', network: 'Rede Estadual' },
    { id: '3', name: 'Prof. Ana', network: 'Rede Estadual' },
    { id: '4', name: 'Prof. João', network: 'Rede Estadual' }
];

const APPROVAL_QUORUM = 3;

let currentUser = MOCK_USERS[0];
let recesses = [];

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

function getDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} ${days === 1 ? 'dia' : 'dias'}`;
}

function getUserName(userId) {
    const user = MOCK_USERS.find(u => u.id === userId);
    return user ? user.name : 'Usuário';
}

// Render Functions
function renderUserSelector() {
    const userButtons = document.getElementById('userButtons');
    const currentNetwork = document.getElementById('currentNetwork');

    userButtons.innerHTML = MOCK_USERS.map(user => `
        <button 
            class="user-button ${user.id === currentUser.id ? 'active' : ''}"
            onclick="changeUser('${user.id}')"
        >
            ${user.name}
        </button>
    `).join('');

    currentNetwork.textContent = currentUser.network;
}

function renderStatistics() {
    const visibleRecesses = getVisibleRecesses();
    const pending = visibleRecesses.filter(r => r.status === 'pending').length;
    const approved = visibleRecesses.filter(r => r.status === 'approved').length;
    const denied = visibleRecesses.filter(r => r.status === 'denied').length;

    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('approvedCount').textContent = approved;
    document.getElementById('deniedCount').textContent = denied;
}

function renderRecessItem(recess) {
    const userHasVoted = recess.votes.some(v => v.userId === currentUser.id);
    const userVote = recess.votes.find(v => v.userId === currentUser.id);
    const approveCount = recess.votes.filter(v => v.vote === 'approve').length;
    const denyCount = recess.votes.filter(v => v.vote === 'deny').length;
    const isSuggestedByCurrentUser = recess.suggestedBy === currentUser.id;

    let statusBadge = '';
    if (recess.status === 'pending') {
        statusBadge = '<span class="badge pending">Pendente</span>';
    } else if (recess.status === 'approved') {
        statusBadge = '<span class="badge approved">Aprovado</span>';
    } else if (recess.status === 'denied') {
        statusBadge = '<span class="badge denied">Negado</span>';
    }

    let votingSection = '';
    if (recess.status === 'pending') {
        const progressWidth = Math.min((approveCount / APPROVAL_QUORUM) * 100, 100);
        
        votingSection = `
            <div class="voting-section">
                <div class="vote-progress">
                    <div class="vote-count">
                        <span style="color: #16a34a;">👍</span>
                        <span>${approveCount}/${APPROVAL_QUORUM}</span>
                    </div>
                    <div class="vote-count">
                        <span style="color: #dc2626;">👎</span>
                        <span>${denyCount}/${APPROVAL_QUORUM}</span>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressWidth}%"></div>
                </div>
                ${!isSuggestedByCurrentUser ? `
                    <div class="vote-buttons">
                        <button 
                            class="btn btn-approve ${userVote?.vote === 'approve' ? 'voted' : ''}"
                            onclick="vote('${recess.id}', 'approve')"
                            ${userHasVoted ? 'disabled' : ''}
                        >
                            <span>👍</span>
                            ${userVote?.vote === 'approve' ? 'Você aprovou' : 'Aprovar'}
                        </button>
                        <button 
                            class="btn btn-deny ${userVote?.vote === 'deny' ? 'voted' : ''}"
                            onclick="vote('${recess.id}', 'deny')"
                            ${userHasVoted ? 'disabled' : ''}
                        >
                            <span>👎</span>
                            ${userVote?.vote === 'deny' ? 'Você negou' : 'Negar'}
                        </button>
                    </div>
                ` : `
                    <div class="waiting-message">
                        Aguardando validação dos colegas da rede
                    </div>
                `}
            </div>
        `;
    } else {
        votingSection = `
            <div class="vote-summary">
                <div class="vote-count">
                    <span style="color: #16a34a;">👍</span>
                    <span>${approveCount} aprovações</span>
                </div>
                <div class="vote-count">
                    <span style="color: #dc2626;">👎</span>
                    <span>${denyCount} negações</span>
                </div>
            </div>
            ${recess.status === 'approved' ? `
                <div class="approved-message">
                    ✓ Este período está bloqueado para novos eventos no calendário escolar
                </div>
            ` : ''}
        `;
    }

    let votersList = '';
    if (recess.votes.length > 0) {
        votersList = `
            <div class="voters-list">
                <div class="voters-title">Votos recebidos:</div>
                <div class="voters-badges">
                    ${recess.votes.map(vote => `
                        <div class="voter-badge ${vote.vote}">
                            <span>${vote.vote === 'approve' ? '👍' : '👎'}</span>
                            <span>${vote.userName}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    return `
        <div class="recess-item">
            <div class="recess-header">
                <div class="recess-title-group">
                    <div class="recess-title">
                        <h3>${recess.description}</h3>
                        ${statusBadge}
                    </div>
                    <div class="recess-meta">
                        <div class="meta-item">
                            <span>📅</span>
                            <span>${formatDate(recess.startDate)} - ${formatDate(recess.endDate)}</span>
                        </div>
                        <div class="meta-item">
                            <span>⏱️</span>
                            <span>${getDuration(recess.startDate, recess.endDate)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="suggester-info">
                <span>👤</span>
                <span>
                    ${isSuggestedByCurrentUser ? 'Você sugeriu' : 'Sugerido'} em ${formatDate(recess.createdAt)}
                </span>
            </div>
            ${votingSection}
            ${votersList}
        </div>
    `;
}

function getVisibleRecesses() {
    return recesses.filter(recess => {
        if (recess.suggestedBy === currentUser.id) return true;
        if (recess.status === 'approved' || recess.status === 'denied') return true;
        if (recess.status === 'pending' && recess.suggestedBy !== currentUser.id) return true;
        return false;
    });
}

function renderRecesses() {
    const visibleRecesses = getVisibleRecesses();
    
    const pending = visibleRecesses.filter(r => r.status === 'pending');
    const approved = visibleRecesses.filter(r => r.status === 'approved');
    const denied = visibleRecesses.filter(r => r.status === 'denied');

    // Pending
    const pendingSection = document.getElementById('pendingSection');
    const pendingList = document.getElementById('pendingList');
    if (pending.length > 0) {
        pendingSection.style.display = 'block';
        pendingList.innerHTML = pending.map(r => renderRecessItem(r)).join('');
    } else {
        pendingSection.style.display = 'none';
    }

    // Approved
    const approvedSection = document.getElementById('approvedSection');
    const approvedList = document.getElementById('approvedList');
    if (approved.length > 0) {
        approvedSection.style.display = 'block';
        approvedList.innerHTML = approved.map(r => renderRecessItem(r)).join('');
    } else {
        approvedSection.style.display = 'none';
    }

    // Denied
    const deniedSection = document.getElementById('deniedSection');
    const deniedList = document.getElementById('deniedList');
    if (denied.length > 0) {
        deniedSection.style.display = 'block';
        deniedList.innerHTML = denied.map(r => renderRecessItem(r)).join('');
    } else {
        deniedSection.style.display = 'none';
    }

    // Empty state
    const emptyState = document.getElementById('emptyState');
    emptyState.style.display = visibleRecesses.length === 0 ? 'block' : 'none';
}

function render() {
    renderUserSelector();
    renderStatistics();
    renderRecesses();
}

// Event Handlers
function changeUser(userId) {
    currentUser = MOCK_USERS.find(u => u.id === userId);
    render();
}

function addRecess(description, startDate, endDate) {
    const newRecess = {
        id: Date.now().toString(),
        description,
        startDate,
        endDate,
        suggestedBy: currentUser.id,
        status: 'pending',
        votes: [],
        createdAt: new Date().toISOString()
    };
    recesses.push(newRecess);
    render();
}

function vote(recessId, voteType) {
    const recess = recesses.find(r => r.id === recessId);
    if (!recess) return;

    // Check if user already voted
    const existingVote = recess.votes.find(v => v.userId === currentUser.id);
    if (existingVote) return;

    // Add vote
    const newVote = {
        userId: currentUser.id,
        userName: currentUser.name,
        vote: voteType,
        timestamp: new Date().toISOString()
    };
    recess.votes.push(newVote);

    // Check if quorum reached
    const approveCount = recess.votes.filter(v => v.vote === 'approve').length;
    const denyCount = recess.votes.filter(v => v.vote === 'deny').length;

    if (approveCount >= APPROVAL_QUORUM) {
        recess.status = 'approved';
    } else if (denyCount >= APPROVAL_QUORUM) {
        recess.status = 'denied';
    }

    render();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Form Handler
    document.getElementById('recessForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const description = document.getElementById('description').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (!description || !startDate || !endDate) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert('A data de início deve ser anterior à data de término');
            return;
        }

        addRecess(description, startDate, endDate);
        
        // Reset form
        document.getElementById('description').value = '';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
    });

    // Initial render
    render();
});
