document.getElementById('saveButton').addEventListener('click', function() {
    var content = document.getElementById('scratchpad').value;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/save', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert('Content saved successfully');
        }
    };
    xhr.send('content=' + encodeURIComponent(content));
});
