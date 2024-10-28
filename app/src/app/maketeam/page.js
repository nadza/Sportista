"use client"

import AddModal from "../components/modals/AddPlayerTeamModal"
import TeamModal from "../components/modals/TeamModal"

export default function AppointmentPage() {
    return(
        <div>
            
            <p>Ovaj ispod je za dodavanje igraca u tim</p>
            <AddModal/>
            <TeamModal></TeamModal>
        </div>
    )
}