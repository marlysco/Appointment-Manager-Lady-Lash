//Storing the selected user
// const formGetDate = async (event) => {
//     event.preventDefault();
//     const app_date = document.getElementsByName("app_date").value;
//     console.log("test");
//     if (app_date) {
//       console.log(app_date);
//       alert(`The selected date is ${app_date}`);
//       return app_date;
//       } else {
//         alert('Failed to get the appoiment date');
//       }
//   };
//
//   const serviceFormHandler = async (event) => {
//     event.preventDefault();
//     const service_name = document.getElementsByName("service").value;
//     if (!service_name) {
//         alert(`Please select one option!`);
//     }
//     else {
//         return service_name;
//     };
//   };
//
// const hourFormHandler = async (event) => {
//     event.preventDefault();
//     const app_hour = document.getElementsByName('app_hour').value;
//     if (!app_hour) {
//         alert(`Please select one option!`);
//     }
//     else {
//         return app_hour
//     }
//    };
//
// const createAppointment = async (event) => {
//     event.preventDefault();
//     if (app_date && service && app_hour) {
//         const response = await fetch(`/api/appointment/create`, {
//           method: 'POST',
//           body: JSON.stringify({app_date, service, app_hour}),
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         if (response.ok) {
//           document.location.replace('/homepage');
//         } else {
//           alert('Failed to create appoiments');
//         }
//       }
//     else {
//         alert("Please enter all the values to create an appointment")
//     }
// };
//
// const showConfirmBtn = () => {
//     if (!app_date && app_hour && service_name) {
//         document.getElementById("submitApp").display="none"
//        }
//        else {
//         document.getElementById("submitApp").display="block"
//        }
// };
//
// showConfirmBtn ();
//
//   document
//     .getElementById("app-date-btn")
//     .addEventListener('click', formGetDate);
//
//   document
//     .getElementById("app_hour")
//     .getElementsByName('change', hourFormHandler);
//
//  document
//     .getElementById("service")
//     .getElementsByName('change', serviceFormHandler);
//
// document
//     .getElementById("submitApp")
//     .addEventListener('click', serviceFormHandler);
