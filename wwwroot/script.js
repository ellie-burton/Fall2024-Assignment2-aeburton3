const apiEndpoint = 'https://api.bing.microsoft.com/v7.0/search'; 
const apiKey = 'bd4316d0d7c846608d3946c479177e8a'; 
$(document).ready(function () {
    function apiSearch(callback) {
        const query = $('#query').val();
        if (!query) {
            alert('Please enter a search query');
            return;
        }

        $.ajax({
            url: apiEndpoint,
            type: 'GET',
            headers: {
                'Ocp-Apim-Subscription-Key': apiKey
            },
            data: {
                q: query,
                count: 10,
                mkt: 'en-us'
            }
        }).done(function (data) {
            if (callback) {
                callback(data);
            } else {
                if (data.webPages && data.webPages.value.length > 0) {
                    let resultsHtml = data.webPages.value.map(result => `
                        <div class="result">
                            <a href="${result.url}" target="_blank" class="result-title">${result.name}</a><br>
                            <span class="result-url">${result.url}</span>
                            <p class="result-snippet">${result.snippet}</p>
                        </div>
                    `).join('');
                    $('#searchResults').html(resultsHtml).css('visibility', 'visible').dialog({
                        width: 600,
                        maxHeight: 400,
                        modal: true
                    });
                } else {
                    $('#searchResults').html('<p>No results found.</p>').css('visibility', 'visible').dialog({
                        width: 600,
                        maxHeight: 400,
                        modal: true
                    });
                }
            }
        }).fail(function () {
            alert('Error fetching search results.');
        });
    }

    function feelingLucky() {
        apiSearch(function (data) {
            if (data.webPages && data.webPages.value.length > 0) {
                window.location.href = data.webPages.value[0].url;
            } else {
                alert("No results found.");
            }
        });
    }

    let toggle = false;
    function changeBackgroundImage() {
        $('body').css('background-image', toggle
            ? "url('https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1803&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
            : "url('https://images.unsplash.com/photo-1492463104320-56094d69c6c4?q=80&w=3862&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')");
        toggle = !toggle;
    }

    function showCurrentTime() {
        const now = new Date();
        const formattedTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        $('#time').html(`<p>The current time is: ${formattedTime}</p>`).css('visibility', 'visible').dialog({
            width: 400,
            modal: true
        });
    }

    $('#searchButton').on('click', () => apiSearch());
    $('#luckyButton').on('click', feelingLucky);
    $('#searchEngineName').on('click', changeBackgroundImage);
    $('#timeButton').on('click', showCurrentTime);
    $('body').click(changeBackgroundImage);
});
