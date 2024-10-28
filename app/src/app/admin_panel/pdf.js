import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { colors } from '../../colors.js';
const content = {
  en: {
    users: {
      title: "User Data",
      column: ["Username", "First Name", "Last Name", "Email", "Password"]
    },
    areas: {
      title: "Area Data",
      column: ["Name", "Description", "Location info", "Grade"]
    },
    teams: {
      title: "Team Data",
      column: ["Name", "Foundation date", "Leader", "Sport"]
    },
    sports: {
      title: "Sport Data",
      column: ["Name"]
    },
    companies: {
      title: "Company Data",
      column: ["Name", "E-mail", "Phone number", "Location", "Description"]
    },
    reviews: {
      title: "Review Data",
      column: ["Review giver", "Review taker", "Grade", "Review"]
    },
    appointments: {
      title: "Appointment Data",
      column: ["Time", "Area", "Team"]
    }
  },
  bs: {
    users: {
      title: "Korisnicki Podatci",
      column: ["Korisnicko ime", "Ime", "Prezime", "E-mail", "Lozinka"]
    },
    areas: {
      title: "Tereni Podatci",
      column: ["Naziv", "Opis", "Lokacija", "Ocjena"]
    },
    teams: {
      title: "Timovi Podatci",
      column: ["Naziv", "Datum osnivanja", "Voda", "Sport"]
    },
    sports: {
      title: "Sport Podatci",
      column: ["Naziv"]
    },
    companies: {
      title: "Tvrtke Podatci",
      column: ["Naziv", "E-mail", "Telefonski broj", "Lokacija", "Opis"]
    },
    reviews: {
      title: "Recenzije Podatci",
      column: ["Davatelj recenzije", "Primatelj recenzije", "Ocjena", "Recenzija"]
    },
    appointments: {
      title: "Termini Podatci",
      column: ["Vrijeme", "Teren", "Tim"]
    }

  }
}

export function generatePDF(language,type,data) {
  const doc = new jsPDF({
    format: 'a4'
  });
  let title = "";
  let tableColumn = [];
  let tableRows = [];
  let columnStyles = {};


  switch (type) {
    case "users":
      doc.text(content[language].users.title, 14, 16);
      tableColumn = content[language].users.column;
      tableRows = data.map(user => [
        user.username,
        user.first_name,
        user.last_name,
        user.email,
        user.hashed_password
      ]);
      columnStyles = {
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 50 },
        4: { cellWidth: 'auto' }
      };
      break;
    case "areas":
      doc.text(content[language].areas.title, 14, 16);
      tableColumn = content[language].areas.column;
      tableRows = data.map(area => [
        area.name,
        area.description,
        area.location_info,
        area.grade
      ]);
      break;
    case "teams":
      doc.text(content[language].teams.title, 14, 16);
      tableColumn = content[language].teams.column;
      tableRows = data.map(team => [
        team.name,
        team.foundation_date,
        team.leader,
        team.sport_id
      ]);
      break;
    case "sports":
      doc.text(content[language].sports.title, 14, 16);
      tableColumn = content[language].sports.column;
      tableRows = data.map(sport => [sport.name]);
      break;
    case "companies":
      doc.text(content[language].companies.title, 14, 16);
      tableColumn = content[language].companies.column;
      tableRows = data.map(company => [
        company.name,
        company.email,
        company.phone_number,
        company.location,
        company.description
      ]);
      break;
    case "reviews":
      doc.text(content[language].reviews.title, 14, 16);
      tableColumn = content[language].companies.column;
      tableRows = data.map(review => [
        review.review_giver,
        review.review_taker,
        review.grade,
        review.review
      ]);
      break;
    case "appointments":
      doc.text(content[language].appointments.title, 14, 16);
      tableColumn = content[language].companies.column;
      tableRows = data.map(appointment => [
        appointment.time,
        appointment.area_name,
        appointment.team_name
      ]);
      break;
    default:
      console.log("Type is not recognized");
      return;
  }

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    headStyles: { fillColor: colors.CHILI_RED },
    styles: { cellPadding: 3, fontSize: 10},
    columnStyles: columnStyles,
    margin: { top: 20 }
  });

  doc.save(`${type}.pdf`);
}