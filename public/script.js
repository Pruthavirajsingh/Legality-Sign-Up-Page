const avatarInput = document.getElementById('avatarInput');
const avatarPreview = document.getElementById('avatarPreview');

avatarInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(ev) {
      avatarPreview.src = ev.target.result;
    }
    reader.readAsDataURL(file);
  }
});

document.getElementById('signup-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Demo: just alert, actual upload needs AJAX/fetch
  const displayName = document.getElementById('displayName').value;
  alert(`Welcome, ${displayName}! (This is just a UI demo.)`);
  // Here you can send data via fetch/post if backend is ready
});
