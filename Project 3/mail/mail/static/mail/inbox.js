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

  document.querySelector('#compose-form').onsubmit = send_email;

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

function send_email(){

  const recipients = document.querySelector("#compose-recipients").value; 
  const subject = document.querySelector("#compose-subject").value; 
  const body = document.querySelector("#compose-body").value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    }),
  })
  .then((response) => response.json())
  .then((result) => {
    console.log(result);
  });
  localStorage.clear();
  load_mailbox("sent");
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
  // div for sender name
  const recipient = document.createElement("div");
  recipient.className = "column";
  if (mailbox === "inbox") {
    recipient.innerHTML = email.sender;
  } else {
    recipient.innerHTML = email.recipient;
  }
  document.querySelector("#emails-view").append(recipient);

  // div for email subject
  const subject = document.createElement("div");
  subject.className = "column";
  subject.innerHTML = email.subject;
  document.querySelector("#emails-view").append(subject);

  // div for email timestamp
  const datetime = document.createElement("div");
  datetime.className = "column";
  datetime.innerHTML = email.timestamp;
  document.querySelector("#emails-view").append(datetime);
}
