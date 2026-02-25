document.getElementById('saveButton').addEventListener('click', function() {
    var content = document.getElementById('scratchpad').value;
    var csrfToken = document.getElementById('csrf_token').value;
    var statusEl = document.getElementById('saveStatus');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/save', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                statusEl.textContent = 'Saved successfully';
                statusEl.style.color = 'green';
            } else {
                statusEl.textContent = 'Save failed, please try again';
                statusEl.style.color = 'red';
            }
            setTimeout(function() { statusEl.textContent = ''; }, 3000);
        }
    };
    xhr.send('content=' + encodeURIComponent(content) + '&csrf_token=' + encodeURIComponent(csrfToken));
});
