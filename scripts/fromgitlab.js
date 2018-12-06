const querystring = require('query-string')
const url = require('url')

module.exports = (robot) => {
    let gitlabroom = process.env.GITLAB_CHANNEL || "general"
    let user = {}
    user.room = gitlabroom
    user.user = ""
    user.user.roomID = user.room
    // if env var has GITLAB_BRANCHES specified, add to array
    let branches = ['all']
    if (process.env.GITLAB_BRANCHES) {
        branches = process.env.GITLAB_BRANCHES.split(',')
    }
    let showCommitsList = process.env.GITLAB_SHOW_COMMITS_LIST || "1"
    let showMergeDesc = process.env.GITLAB_SHOW_MERGE_DESCRIPTION || "1"

    function strip_content(str) {
        let res = str.split(/\n/).filter((line) =>
            // Remove the \n first so we have content only
            line.length != 0)
        // console.log(JSON.stringify(res))
        // get element 0 ... 4
        if (res.length > 5) {
            res = res.slice(0, 5)
        }
        return res.join("\r\n")
    }

    function bold(txt) {
        return "**" + txt + "**"
    }

    function underline(txt) {
        // no underline - use italics
        return "*" + txt + "*"
    }
  
    function Handler(type, req, res) {
        let query = querystring.parse(url.parse(req.url).query)
        let hook = req.body
        //console.log(JSON.stringify(query))
        //console.log(JSON.stringify(hook))
        if (query.branches) {
            branches = query.branches.split(',')
        }
        if (hook.object_kind == "build") {
            robot.adapter.send(user, "Build of " + hook.project_name + ' id: ' + hook.project_id + ' ref: ' + hook.ref + ' name: ' + hook.build_name + ' stage: ' + hook.build_stage + ' status: ' + hook.build_status + '. Time: ' + hook.build_duration)
        }
        switch (type) {
            case "system": {
                switch (hook.event_name) {
                    case "project_create":
                        robot.adapter.send(user, `Yay! New Gitlab project  *${hook.name}* created by *${hook.owner_name} ${hook.owner_email}*`)
                        break;
                    case "project_destroy":
                        robot.adapter.send(user, `Oh no! *${hook.owner_name} ${hook.owner_email}* deleted the *${hook.name}* project`)
                        break;
                    case "user_add_to_team":
                        robot.adapter.send(user, `*${hook.access_level}* access granted to *${hook.user_name} ${hook.user_email}* on *${hook.project_name}* project`)
                        break;
                    case "user_remove_from_team":
                        robot.adapter.send(user, `*${hook.access_level}* access revoked from *${hook.user_name} ${hook.user_email}* on *${hook.project_name}* project`)
                        break;
                    case "user_create":
                        robot.adapter.send(user, `Please welcome *${hook.name} ${hook.email}* to Gitlab!`)
                        break;
                    case "user_destroy":
                        robot.adapter.send(user, `We will be missing *${hook.name} ${hook.email}* on Gitlab`)
                        break;
                    case "project_rename":
                        robot.adapter.send(user, `Gitlab project *${hook.old_path_with_namespace}* has been moved to *${hook.path_with_namespace}*`)
                        break;
                    case "project_transfer":
                        robot.adapter.send(user, `Gitlab project *${hook.old_path_with_namespace}* has been moved to *${hook.path_with_namespace}*`)
                        break;
                    case "project_update":
                        robot.adapter.send(user, `Gitlab project *${hook.name}* has been updated`)
                        break;
                    case "user_failed_login":
                        robot.adapter.send(user, `Blocked user *${hook.name}* has been denied access`)
                        break;
                    case "user_rename":
                        robot.adapter.send(user, `*${hook.old_username}* is now *${hook.username}*`)
                        break;
                    case "key_create":
                        robot.adapter.send(user, `New key for *${hook.username}* added :key:`)
                        break;
                    case "key_destroy":
                        robot.adapter.send(user, `Key for *${hook.username}* destroyed :key:`)
                        break;
                    case "group_create":
                        robot.adapter.send(user, `New group *${hook.name}* created`)
                        break;
                    case "group_destroy":
                        robot.adapter.send(user, `Oh no! group *${hook.name}* has been removed`)
                        break;
                    case "group_rename":
                        robot.adapter.send(user, `Group *${hook.old_full_path}* is now *${hook.full_path}*`)
                        break;
                    case "user_add_to_group":
                        robot.adapter.send(user, `*${hook.user_name}* is now a member of *${hook.group_name}*`)
                        break;
                    case "user_remove_from_group":
                        robot.adapter.send(user, `*${hook.user_name}* is no longer a member of *${hook.group_name}*`)
                        break;
                    default:
                        robot.adapter.send(user, `${hook.event_name} event received from Gitlab... but I don't know what to do with it`)
                        break;
                }
                break;
            } // of case system
            case "web": {
                let message = ""

                if (hook.ref) {   //  is it code being pushed?
                    // should look for a tag push where the ref starts with refs/tags
                    if (/^refs\/tags/.test(hook.ref)) {
                        let tag = hook.ref.split("/").slice(2).join("/")

                        console.log(tag)
                        //this is actually a tag being pushed
                        if (/^0+$/.test(hook.before)) {
                            message = `${bold(hook.user_name)} pushed a new tag (${bold(tag)}) to ${bold(hook.repository.name)} (${underline(hook.repository.homepage)})`
                        }
                        else {
                            if (/^0+$/.test(hook.after)) {
                                message = `${bold(hook.user_name)} removed a tag (${bold(tag)}) from ${bold(hook.repository.name)} (#{underline(hook.repository.homepage)})`
                            } // of .test(hook.after)
                            else {
                                if (hook.total_commits_count == 1) {
                                    message = `${bold(hook.user_name)} pushed ${bold(hook.total_commits_count)} commit to tag (${bold(tag)}) in ${bold(hook.repository.name)} (${underline(hook.repository.homepage)})`
                                }
                                else {
                                    message = `${bold(hook.user_name)} pushed ${bold(hook.total_commits_count)} commits to tag (${bold(tag)}) in ${bold(hook.repository.name)} (${underline(hook.repository.homepage)})`
                                } // of hook.total_commits_count   
                            } // of else .test hook.after
                        } // of hook.before
                        console.log("message is " + message)
                        robot.adapter.send(user, message)
                    } // of if   .test(hook.ref)
                    else { // of test(hook.ref)
                        let branch = hook.ref.split("/").slice(2).join("/")
                        //console.log("branch is " + branch)
                        //console.log("branches is " + JSON.stringify(branches))
                        // if the ref before the commit is 00000, this is a new branch
                        if ((branches.includes(branch)) || (branches.includes("all"))) {
                           //console.log("Branch in Branches")
                            if (/^0+$/.test(hook.before)) {
                                message = `${bold(hook.user_name)} pushed a new branch (${bold(branch)}) to ${bold(hook.repository.name)} (${underline(hook.repository.homepage)})`
                                //console.log("message is " + message)
                            } // of test hook.before
                            else {
                                if (/^0+$/.test(hook.after)) {
                                    message = `${bold(hook.user_name)} deleted a branch (${bold(branch)}) from ${bold(hook.repository.name)} (${underline(hook.repository.homepage)})`
                                    //console.log("message is " + message)
                                } // test hook.after
                                else {
                                    message = `${bold(hook.user_name)} pushed ${bold(hook.total_commits_count)} commits to ${bold(branch)} in ${bold(hook.repository.name)} (${underline(hook.repository.homepage + '/compare/' + hook.before.substr(0, 9) + '...' + hook.after.substr(0, 9))})`
                                    //console.log("message is " + message)
                                    if (showCommitsList == "1") {
                                        let merger = []
                                        let mlen = hook.commits.length
                                        for (var i = 0; i < mlen; i++) {
                                            merger[i] = "> " + hook.commits[i].id.slice(0, 7) + ": " + hook.commits[i].message.replace(/\n.*$/gm, '')
                                            robot.emit("gitlab-commit", {
                                                // user: user,
                                                repo: hook.repository.name,
                                                message: hook.commits[i].message,
                                                commit: hook.commits[i]
                                            })
                                        }
                                        message += "\r\n" + merger.join("\r\n")
                                    } // of if showCommitList == 1
                                } // of test hook.after
                            } // of test hook.before
                        }  // of if branch in branches or all in branches
                    } // of test(hook.ref)
                    robot.adapter.send(user, message)
                } // of if hook.ref
                // not code? must be a something good!

                else {  // of if hook.ref
                    switch (hook.object_kind) {
                        case "wiki_page": {
                            let text = `${hook.user.name} did ${hook.object_attributes.action} wiki page: ${bold(hook.object_attributes.title)} at ${hook.object_attributes.url}`
                            robot.adapter.send(user, text)
                            break;
                        }  // case wiki_page
                        case "issue": {
                            if (!(hook.object_attributes.action === "update")) {
                                //console.log("ISSUE")
                                //  for now we don't trigger on update because on manual close it triggers close and update
                                let text = `Issue ${bold(hook.object_attributes.iid)}: ${hook.object_attributes.title} (${hook.object_attributes.action}) at ${hook.object_attributes.url}`
                                if (hook.object_attributes.description) {
                                    // split describtion on \r\n so that It can add >> to every line
                                    let splitted = strip_content(hook.object_attributes.description).split("\r\n")
                                    let slen = splitted.length
                                    //console.log(JSON.stringify(splitted))
                                    for (var i = 0; i < slen; i++) {
                                        splitted[i] = ">> " + splitted[i]
                                    }
                                    //console.log("DONE")
                                    text += "\r\n" + splitted.join("\r\n")
                                } // of if hook.object_attributes.description
                                //console.log(JSON.stringify(user))
                                robot.adapter.send(user, text)
                            } // if ! update
                            break;
                        } // case issue
                        case "merge_request": {
                            console.log("IN MR..")
                            if (!(hook.object_attributes.action === "update")) {
                                if (showMergeDesc == "1") {
                                    let text = `Merge Request ${bold(hook.object_attributes.iid)}: ${hook.user.username} ${hook.object_attributes.action}  ${hook.object_attributes.title} between ${bold(hook.object_attributes.source_branch)} and ${bold(hook.object_attributes.target_branch)} at ${bold(hook.object_attributes.url)}\n`
                                    let splitted = strip_content(hook.object_attributes.description).split("\r\n")
                                    let slen = splitted.length
                                    for (var i = 0; i < slen; i++) {
                                        splitted[i] = "> " + splitted[i]
                                    }
                                    //console.log("MR is " + JSON.stringify(splitted))
                                    text += "\r\n" + splitted.join("\r\n")
                                    robot.adapter.send(user, text)
                                } // showMergeDesc == 1
                                else {
                                    robot.adapter.send(user, `Merge Request ${bold(hook.object_attributes.iid)}: ${hook.user.username} ${hook.object_attributes.action}  ${hook.object_attributes.title} (${hook.object_attributes.state}) between ${bold(hook.object_attributes.source_branch)} and ${bold(hook.object_attributes.target_branch)} at ${bold(hook.object_attributes.url)}`)
                                } // else of showMergeDesc == 1
                            } // if ! update
                            break;
                        } // case merge_request 

                        case "note": {
                            let text = ""
                            switch (hook.object_attributes.noteable_type) {
                                case "Commit": {
                                    text = `Commit ${bold(hook.object_attributes.commit_id.substr(0, 9))}: has been updated by ${bold(hook.user.name)} at ${bold(hook.object_attributes.url)}\r\n>> ${strip_content(hook.object_attributes.note)}`
                                    break;
                                } // of Commit
                                case "MergeRequest": {
                                    text = `Merge Requst ${bold(hook.merge_request.iid)}: has been updated by ${bold(hook.user.name)} at ${bold(hook.object_attributes.url)}\r\n>> ${strip_content(hook.object_attributes.note)}`
                                    break;
                                } // of MergeRequest
                                case "Issue": {
                                    text = `Issue ${bold(hook.issue.iid)}: has been updated by ${bold(hook.user.name)} at ${bold(hook.object_attributes.url)}\r\n>> ${strip_content(hook.object_attributes.note)}`
                                    break;
                                } // of Issue
                                case "Snippet": {
                                    text = `Snippet ${bold(hook.snippet.id)}: has been updated by ${bold(hook.user.name)} at ${bold(hook.object_attributes.url)}\r\n>> ${strip_content(hook.object_attributes.note)}`
                                    break;
                                } // of Snippet
                            } // of switch hook.object_attributes.noteable_type
                            robot.adapter.send(user, text)
                            break;
                        } // case note              
                    } // of   switch(hook.object_kind)                    
                } // of else hook.ref   
                break;
            }// of case web        
        } // of switch
    } // of function Handler

    robot.router.post("/gitlab/system", (req, res) => {
        // handler "system", req, res
        Handler("system", req, res)
        res.end("OK")
    })
    robot.router.post("/gitlab/web", (req, res) => {
        // handler "web", req, res
        Handler("web", req, res)
        res.end("OK")
    })

}
