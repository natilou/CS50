document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);

  document.querySelector("#compose-form").onsubmit = send_email;

  // By default, load the inbox
  load_mailbox("inbox");
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";

  // Clear out composition fields
  document.querySelector("#compose-recipients").value = "";
  document.querySelector("#compose-subject").value = "";
  document.querySelector("#compose-body").value = "";
}

// Send email

function send_email() {
  const recipients = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;

  fetch("/emails", {
    method: "POST",
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      localStorage.clear();
      load_mailbox("sent");
    });

  return false;
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";

  // Show the mailbox name
  document.querySelector("#emails-view").innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Show new mails
  fetch(`/emails/${mailbox}`)
    .then((response) => response.json())
    .then((emails) => {
      console.log(emails);
      emails.forEach((email) => {
        show_mails(email, mailbox);
      });
    });
}

function show_mails(email, mailbox) {
  // div each mail
  let user;
  const mail = document.createElement("div");
  mail.className = "row";

  const buttonColumn = document.createElement("div");
  buttonColumn.className = "col-2";

  if (mailbox === "inbox" || mailbox === "archive") {
    user = email.sender;
  } else if (mailbox === "sent") {
    user = email.recipients;
  }
  mail.innerHTML = `
  <div class="col-3" id="user-div">${user}</div>
  <div class="col-4" id="subject-div" style="cursor:pointer;">${email.subject}</div>
  <div class="col-3">${email.timestamp}</div>`;
  document.querySelector("#emails-view").append(mail);
  mail.style.color = "black";
  mail.append(buttonColumn);

  // button read or unread mail
  if (mailbox === "inbox" || mailbox === "archive") {
    const readButton = document.createElement("button");
    readButton.id = "read-button";
    readButton.className = "btn btn-sm btn-outline-primary";
    readButton.innerHTML = email.read
      ? `<i class="bi bi-envelope" data-toggle="tooltip" data-placement="bottom" title="Mark as unread"></i>`
      : `<i class="bi bi-envelope-open" data-toggle="tooltip" data-placement="bottom" title="Mark as read"></i>`;
    buttonColumn.append(readButton);

    readButton.addEventListener("click", () => {
      changeEmailReadStatus(email, mailbox);
    });
  }

  //click on email to read it

  mail.querySelector("#subject-div").addEventListener("click", () => {
    console.log(email.id);
    readEmail(email, mailbox);
  });

  // change background color if emails is readed
  if (email.read) {
    mail.style.backgroundColor = "white";
  } else {
    mail.style.backgroundColor = "#f4f4f5";
    mail.style.fontWeight = "bold";
  }

  // archive mail
  if (mailbox === "inbox" || mailbox === "archive") {
    const archiveButton = document.createElement("button");
    archiveButton.className = "btn btn-sm btn-outline-primary";
    archiveButton.innerHTML = email.archived
      ? `<i class="bi bi-inbox" data-toggle="tooltip" data-placement="bottom" title="Unarchive"></i>`
      : `<i class="bi bi-archive data-toggle="tooltip" data-placement="bottom" title="Archive"></i>`;
    buttonColumn.append(archiveButton);

    archiveButton.addEventListener("click", () => {
      changeEmailArchiveStatus(email);
    });
  }
}

// view and read one email

function readEmail(email, mailbox) {
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";

  fetch(`emails/${email.id}`)
    .then((response) => response.json())
    .then((email) => {
      if (!email.read) {
        changeEmailReadStatus(email);
      }
      console.log(email);
      document.querySelector("#emails-view").innerHTML = `
      <dl class="row">
        <dt class="col-sm-1">From:</dt> 
        <dd class="col-sm-11">${email.sender}</dd>
        <dt class="col-sm-1">To:</dt>
        <dd class="col-sm-11">${email.recipients}</dd>
        <dt class="col-sm-1">Subject:</dt> 
        <dd class="col-sm-11">${email.subject}</dd> 
        <dt class="col-sm-1">Time:</dt> 
        <dd class="col-sm-11">${email.timestamp}</dd> 
        <dt class="col-sm-1">Content:</dt> 
        <dd class="col-sm-11"> <textarea readonly style="width:100%;"> ${email.body} </textarea></dd>  
      </dl>`;
      if (mailbox === "inbox" || mailbox === "archive") {
        const replyButton = document.createElement("button");
        replyButton.className = "btn btn-sm btn-outline-primary";
        replyButton.innerHTML = "Reply";
        document.querySelector("#emails-view").append(replyButton);
    
        replyButton.addEventListener("click", () => {
          replyEmail(email);
        });
      }
    });
    

  return false;
}
// change read status

function changeEmailReadStatus(email, mailbox) {
  fetch(`/emails/${email.id}`, {
    method: "PUT",
    body: JSON.stringify({
      read: !email.read,
    }),
  }).then((result) => {
    console.log(result);
    load_mailbox(mailbox);
  });
}

// change archive status

function changeEmailArchiveStatus(email) {
  if (!email.archived) {
    fetch(`/emails/${email.id}`, {
      method: "PUT",
      body: JSON.stringify({
        archived: true,
      }),
    }).then((result) => {
      console.log(result);
      load_mailbox("inbox");
    });
  } else {
    fetch(`/emails/${email.id}`, {
      method: "PUT",
      body: JSON.stringify({
        archived: false,
      }),
    }).then((result) => {
      console.log(result);
      load_mailbox("inbox");
    });
  }
}

// reply email
function replyEmail(email) {
  compose_email();
  document.querySelector("#compose-recipients").value = email.sender;
  document.querySelector("#compose-subject").value = email.subject.startsWith("Re:") ? email.subject : `Re: ${email.subject}`;
  document.querySelector("#compose-body").value = `On ${email.timestamp}, ${email.sender} wrote: ${email.body}`;
}
