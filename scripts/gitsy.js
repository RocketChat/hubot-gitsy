const Gitlab = require('gitlab/dist/es5').default;
const pad = require('pad');
const limit = 40    // max 20 issues
module.exports = (robot) => {
    const api = new Gitlab({
        url: process.env['GITLAB_URL'], // Defaults to http://gitlab.com
        token: process.env['GITLAB_API_KEY']	// Can be created in your profile.
    });

    robot.respond(/intro gitsy/i, (res) => {
        let reply = ""
        reply += "Hi, my name is gitsy, and I am the Rocket.Chat gitlab integration bot.\n"
        reply += "You can add me for your own Gitlab CE projects or Gitlab cloud public projects.\n"
        reply += "Find my code here:\n"
        reply += "https://github.com/RocketChat/Rocket.Chat.Ops/tree/master/hubots/hubot-gitsy\n"
        reply += "I can do webhooks, issues, merge requests, and snippets out of the box.\n"
        reply += "Please add to my abilities and contribute your code to Rocket.Chat.\n"
        reply += "projects - list all projects available\n"
        reply += "prs for n - list open merge requests for project #n\n"
        reply += "issues for n - list open issues for project #n\n"
        reply += "snippets for n - list snippets for project #n\n"
        reply += "pr n for m - show merge request #n  for project #m\n"
        reply += "issue n for m - show issue #n for project #m\n"
        reply += "snippet n for m - view snippet #n for project #m\n"
        res.reply(reply);
    });

    robot.respond(/projects/i, async (res) => {
        let projects = await api.Projects.all({ maxPages: 1, perPage: limit });
        // console.log(JSON.stringify(projects))
        let reply = "```\n"
        projects.forEach(function (project, idx) {
            reply += pad("" + (idx + 1), 8) + pad(project.name, 30) + project.created_at + "\n"
        })
        reply += "```"
        res.send(reply);
    })

    robot.respond(/issues for (.*)/i, async (res) => {
        let projects = await api.Projects.all({ maxPages: 1, perPage: limit });
        let selproj = projects[parseInt(res.match[1]) - 1]
        // console.log("PROJECT ID " + selproj.id)
        let reply = "```\n"
        let issues = await api.Issues.all({ projectId: selproj.id, maxPages: 1, perPage: limit, scope: "all", state: "opened" });
        // console.log(JSON.stringify(issues))
        issues.forEach(function (issue, idx) {
            reply += pad("" + issue.iid, 8) + pad(issue.author.name, 20) + issue.title + "\n"
        })
        reply += "```"
        res.send(reply)
    })

    robot.respond(/issue (.*) for (.*)/i, async (res) => {
        let projects = await api.Projects.all();
        let selproj = projects[parseInt(res.match[2]) - 1]
        let issueid = parseInt(res.match[1])
        //console.log("PROJECT ID " + selproj.id)
        //console.log("ISSUE ID" + issueid)
        let reply = "```\n"
        let issues = await api.Issues.all({ projectId: selproj.id, maxPages: 1, perPage: 1, "iids[]": issueid, scope: "all", state: "opened" });
        //console.log(JSON.stringify(issues))
        issues.forEach(function (issue) {
            reply += pad("Issue #", 20) + issue.iid + "\n"
            reply += pad("Opened by", 20) + issue.author.name + "\n"
            reply += pad("Title", 20) + issue.title + "\n"
            let desc = issue.description
            if (issue.description.indexOf("**Imported") > -1)
                desc = issue.description.split("\*\*Imported")[0]
            reply += "Body:\n" + desc + "\n"
            let icon = issue.author.avatar_url
        })
        reply += "```"
        res.send(reply)
    })


    robot.respond(/mrs for (.*)/i, async (res) => {
        let projects = await api.Projects.all();
        let selproj = projects[parseInt(res.match[1]) - 1]
        // console.log("PROJECT ID " + selproj.id)
        let reply = "```\n"
        let mrs = await api.MergeRequests.all({ projectId: selproj.id, maxPages: 1, perPage: limit, scope: "all", state: "opened" })
        mrs.forEach(function (issue) {
            reply += pad("" + issue.iid, 8) + pad(issue.author.name, 20) + issue.title + "\n"
        })
        reply += "```"
        res.send(reply)
    })


    robot.respond(/mr (.*) for (.*)/i, async (res) => {
        let projects = await api.Projects.all();
        let selproj = projects[parseInt(res.match[2]) - 1]
        let mrid = parseInt(res.match[1])
        //console.log("PROJECT ID " + selproj.id)
        //console.log("MERGE REQUEST ID" + mrid)
        let reply = "```\n"
        let mrs = await api.MergeRequests.all({ projectId: selproj.id, "iids[]": mrid, maxPages: 1, perPage: 1, scope: "all", state: "opened" })
        mrs.forEach(function (issue) {
            reply += pad("Merge Request #", 20) + issue.iid + "\n"
            reply += pad("Opened by", 20) + issue.author.name + "\n"
            reply += pad("Title", 20) + issue.title + "\n"
            let desc = issue.description
            reply += "Body:\n" + desc + "\n"
            let icon = issue.author.avatar_url
        })
        reply += "```"
        res.send(reply)
    })

    robot.respond(/snippets for (.*)/i, async (res) => {
        let projects = await api.Projects.all();
        let selproj = projects[parseInt(res.match[1]) - 1]
        // console.log("PROJECT ID " + selproj.id)
        let reply = "```\n"
        let snippets = await api.ProjectSnippets.all(selproj.id, { maxPages: 1, perPage: limit, scope: "all" })
        snippets.forEach(function (snippet) {
            reply += pad("" + snippet.id, 8) + pad(snippet.author.name, 20) + snippet.title + "\n"
        })
        reply += "```"
        res.send(reply)
    })

    robot.respond(/snippet (.*) for (.*)/i, async (res) => {
        let projects = await api.Projects.all();
        let selproj = projects[parseInt(res.match[2]) - 1]
        let snippetid = parseInt(res.match[1])
        //console.log("PROJECT ID " + selproj.id)
        //console.log("SNIPPET ID" + snippetid)
        let reply = "```\n"
        //   console.log( JSON.stringify(snippets))
        let rawcode = await api.ProjectSnippets.content(selproj.id, snippetid);
        // reply += "# ops:gitlabopencode\n#\n"
        reply += rawcode.replace(/^\s*[\r\n]/gm, "")
        reply += "\n```"
        res.send(reply)
    })
}