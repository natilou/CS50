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
  document.querySelector("#emails-view").innerHTML = `<h3>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h3>`;

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
  <div class="col-4">${email.subject}</div>
  <div class="col-3">${email.timestamp}</div>`;
  document.querySelector("#emails-view").append(mail);
  mail.style.color = "black";
  mail.append(buttonColumn);

  // button unread mail
  if (
    (mailbox === "inbox" && email.read) ||
    (mailbox === "archive" && email.read)
  ) {
    const readButton = document.createElement("button");
    readButton.id = "read-button";
    readButton.className = "btn btn-sm btn-outline-primary";
    readButton.innerHTML = "Unread";
    buttonColumn.append(readButton);

    readButton.addEventListener("click", () => {
      fetch(`emails/${email.id}`, {
        method: "PUT",
        body: JSON.stringify({
          read: false,
        }),
      }).then((result) => {
        console.log(result);
        load_mailbox("inbox");
      });
    });
  }

  //click on email to read it

  mail.querySelector("#user-div").addEventListener("click", () => {
    console.log(email.id);
    single_email(`${email.id}`);
  });

  // change background color if emails is readed
  if (email.read) {
    mail.style.backgroundColor = "white";
  } else {
    mail.style.backgroundColor = "#f4f4f5";
  }

  // archive mail
  if (mailbox === "inbox" || mailbox === "archive") {
    const archiveButton = document.createElement("button");
    archiveButton.className = "btn btn-sm btn-outline-primary";
    archiveButton.innerHTML = `${email.archived ? "Unarchived" : "Archive"}`;
    buttonColumn.append(archiveButton);

    archiveButton.addEventListener("click", () => {
      archive_email(email);
    });
  }
}

// view and read one email

function single_email(email_id) {
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";

  fetch(`emails/${email_id}`)
    .then((response) => response.json())
    .then((email) => {
      read_email(email_id);
      console.log(email);
      document.querySelector("#emails-view").innerHTML = `
    <div>From: ${email.sender}</div>
    <div>To: ${email.recipients}</div>
    <div>Subject: ${email.subject}</div> 
    <div>Time: ${email.timestamp} </div>
    <div> ${email.body} </div>
    `;
    });

  return false;
}
// change read status

function read_email(email_id) {
  fetch(`/emails/${email_id}`, {
    method: "PUT",
    body: JSON.stringify({
      read: true,
    }),
  });
}

// change archive status

function archive_email(email) {
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
