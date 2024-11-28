document.getElementById('saveButton').addEventListener('click', function() {
    const content = document.getElementById('scratchpad').value;
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'content=' + encodeURIComponent(content),
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    });
});
