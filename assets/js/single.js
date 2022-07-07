var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");
var languageButtonsEl = document.querySelector("#language-buttons");

var getRepoIssues = function(repo) {
    console.log(repo);
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl)
        .then(function(response) {
            //request was successful
            if (response.ok) {
                response.json().then(function(data) {
                  displayIssues(data);
              
                  // check if api has paginated issues
                  if (response.headers.get("Link")) {
                    displayWarning(repo);
                  }
                });
              }
            else {
                document.location.replace("./index.html");
             }
            })
};

var getRepoName = function() {
    // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    if (repoName) {
        // display repo name on the page
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    }
    else {
        // if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
};


var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on GitHub
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        }
        else {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);
        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    var linkEl = document.createElement("a");
    linkEl.textContent = "See more issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttirbute("target", "_blank");

    //append to warning container
    limitWarningEl.appendChild(linkEl);
};

var buttonClickHandLer = function(event) {
    // the event object has a target property that tells us exactly which HTML element was interacted with to create the event
    // once we know which element we interacted with, we can use the getAttribute() method to read the data-language attribute's value assigned to that element.
    var language = event.target.getAttribute("data-language");
    console.log(language);

    if (language) {
        getFeaturedRepos(language);

        // clear old content 
        repoContainerEl.textContent = "";
    }
}

languageButtonsEl.addEventListener("click", buttonClickHandLer);

getRepoName();