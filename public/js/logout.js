const logout = async () => {
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if(response.ok) {
    console.log("User logged out succesfully");
    location.reload();
  } else {
    console.log(respose.statusText);
  }
};

document.querySelector('#logout').addEventListener('click', logout);
