// Content Review Dashboard - Frontend JavaScript

let currentEditId = null;
let currentEditContent = null;

// Load pending content
async function loadPending() {
    const container = document.getElementById('content-list');
    container.innerHTML = '<div class="loading">Loading...</div>';

    try {
        const response = await fetch('/api/pending');
        const items = await response.json();

        // Update stats
        document.getElementById('pending-count').textContent = items.length;

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>🎉 No Pending Content</h3>
                    <p>All content has been reviewed. Great job!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="content-card" data-id="${item.id}">
                <div class="card-header">
                    <div>
                        <h2>${escapeHtml(item.title || 'Untitled')}</h2>
                        ${item.hasImages
                ? `<span class="image-badge">📸 ${item.imageCount} images</span>`
                : `<span class="image-badge no-images">No images</span>`
            }
                    </div>
                    <span class="brand-badge ${item.brand?.toLowerCase().includes('thach') ? 'thachvuland' : ''}">
                        ${escapeHtml(item.brand || 'Long Best AI')}
                    </span>
                </div>
                
                <div class="card-meta">
                    <strong>Topic:</strong> ${escapeHtml(item.topic || 'N/A')} &nbsp;|&nbsp;
                    <strong>Created:</strong> ${formatDate(item.createdAt)}
                </div>
                
                <div class="slides-preview">
                    ${item.slides?.map((slide, i) => `
                        <div class="slide-item">
                            <span class="slide-type">${i + 1}. ${slide.type}</span>
                            <div class="slide-headline">${escapeHtml(slide.headline || '')}</div>
                            ${slide.content
                    ? `<div class="slide-content">${escapeHtml(truncate(Array.isArray(slide.content) ? slide.content.join(', ') : slide.content, 100))}</div>`
                    : ''
                }
                        </div>
                    `).join('') || '<p>No slides</p>'}
                </div>
                
                <div class="actions">
                    <button class="btn btn-secondary" onclick="editContent('${item.id}')">
                        ✏️ Edit
                    </button>
                    ${!item.hasImages
                ? `<button class="btn btn-primary" onclick="generateImages('${item.id}')">
                            🎨 Generate Images
                        </button>`
                : `<button class="btn btn-secondary" onclick="previewImages('${item.baseName}')">
                            👁️ Preview Images
                        </button>`
            }
                    ${item.hasImages
                ? `<button class="btn btn-success" onclick="approveContent('${item.id}')">
                            ✅ Approve & Publish
                        </button>`
                : ''
            }
                    <button class="btn btn-danger" onclick="rejectContent('${item.id}')">
                        ❌ Reject
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        container.innerHTML = `<div class="empty-state"><h3>Error loading content</h3><p>${error.message}</p></div>`;
    }
}

// Generate images
async function generateImages(id) {
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = '⏳ Generating...';

    try {
        const response = await fetch(`/api/generate/${id}`, { method: 'POST' });
        const result = await response.json();

        if (result.success) {
            showToast('Images generated successfully!', 'success');
            loadPending();
        } else {
            showToast('Failed to generate images: ' + result.error, 'error');
            btn.disabled = false;
            btn.textContent = '🎨 Generate Images';
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        btn.disabled = false;
        btn.textContent = '🎨 Generate Images';
    }
}

// Approve and publish
async function approveContent(id) {
    if (!confirm('Publish this content to Google Drive and update Sheets?')) return;

    const card = document.querySelector(`[data-id="${id}"]`);
    const btn = card.querySelector('.btn-success');
    btn.disabled = true;
    btn.textContent = '⏳ Publishing...';

    try {
        const response = await fetch(`/api/approve/${id}`, { method: 'POST' });
        const result = await response.json();

        if (result.success) {
            showToast('Published successfully!', 'success');
            loadPending();
        } else {
            showToast('Failed to publish: ' + result.error, 'error');
            btn.disabled = false;
            btn.textContent = '✅ Approve & Publish';
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        btn.disabled = false;
        btn.textContent = '✅ Approve & Publish';
    }
}

// Reject content
async function rejectContent(id) {
    const reason = prompt('Reason for rejection (optional):');
    if (reason === null) return; // Cancelled

    try {
        await fetch(`/api/reject/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason })
        });
        showToast('Content rejected', 'success');
        loadPending();
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

// Edit content
async function editContent(id) {
    try {
        const response = await fetch(`/api/content/${id}`);
        currentEditContent = await response.json();
        currentEditId = id;

        const form = document.getElementById('edit-form');
        form.innerHTML = `
            <div class="form-group">
                <label>Title</label>
                <input type="text" id="edit-title" value="${escapeHtml(currentEditContent.title || '')}">
            </div>
            <div class="form-group">
                <label>Topic</label>
                <input type="text" id="edit-topic" value="${escapeHtml(currentEditContent.topic || '')}">
            </div>
            <div class="form-group">
                <label>Brand</label>
                <input type="text" id="edit-brand" value="${escapeHtml(currentEditContent.brand || '')}">
            </div>
            <h3 style="margin: 20px 0 10px;">Slides</h3>
            ${currentEditContent.slides?.map((slide, i) => `
                <div class="form-group" style="background: var(--bg-dark); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <label>Slide ${i + 1} (${slide.type})</label>
                    <input type="text" id="slide-headline-${i}" value="${escapeHtml(slide.headline || '')}" placeholder="Headline">
                    <textarea id="slide-content-${i}" placeholder="Content" style="margin-top: 10px;">${escapeHtml(Array.isArray(slide.content) ? slide.content.join('\n') : (slide.content || ''))}</textarea>
                </div>
            `).join('')}
            <div class="actions" style="margin-top: 20px;">
                <button class="btn btn-success" onclick="saveEdit()">💾 Save Changes</button>
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        `;

        document.getElementById('edit-modal').style.display = 'block';
    } catch (error) {
        showToast('Error loading content: ' + error.message, 'error');
    }
}

// Save edited content
async function saveEdit() {
    currentEditContent.title = document.getElementById('edit-title').value;
    currentEditContent.topic = document.getElementById('edit-topic').value;
    currentEditContent.brand = document.getElementById('edit-brand').value;

    currentEditContent.slides.forEach((slide, i) => {
        slide.headline = document.getElementById(`slide-headline-${i}`).value;
        const contentVal = document.getElementById(`slide-content-${i}`).value;
        // Check if original was array (list type)
        if (slide.type === 'list') {
            slide.content = contentVal.split('\n').filter(line => line.trim());
        } else {
            slide.content = contentVal;
        }
    });

    try {
        await fetch(`/api/content/${currentEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentEditContent)
        });
        showToast('Content saved!', 'success');
        closeModal();
        loadPending();
    } catch (error) {
        showToast('Error saving: ' + error.message, 'error');
    }
}

// Preview images
async function previewImages(baseName) {
    try {
        const response = await fetch(`/api/images/${baseName}`);
        const images = await response.json();

        const carousel = document.getElementById('image-carousel');
        carousel.innerHTML = images.map(src => `
            <img src="${src}" alt="Slide" onclick="window.open('${src}', '_blank')">
        `).join('');

        document.getElementById('preview-modal').style.display = 'block';
    } catch (error) {
        showToast('Error loading images: ' + error.message, 'error');
    }
}

// Modal controls
function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
    currentEditId = null;
    currentEditContent = null;
}

function closePreviewModal() {
    document.getElementById('preview-modal').style.display = 'none';
}

// Close modal on outside click
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Utility functions
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function truncate(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('vi-VN');
}

// Initial load
loadPending();

// Auto-refresh every 30 seconds
setInterval(loadPending, 30000);
