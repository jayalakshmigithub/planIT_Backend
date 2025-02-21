import { projectModel } from "../../model/projectModel.js";


const validateProjectAccess = async(req,res,next)=>{
    try {
        const {projectId} = req.params
        const userId = req.userId
        const project = await projectModel.findById(projectId)
        if(!project) return res.status(404).json({message:"Project not found"})
        
            const currentTime = new Date()
            const projectDeadline = new Date(project.toDate)

            const isOwner = project.owner && project.owner.toString()===userId
            const isPastDeadline = currentTime > projectDeadline;

            if (isPastDeadline && !isOwner) {
                return res.status(403).json({ message: "Project is closed. Members cannot access it." });
            }
    
            req.project = project; 
            next()        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
        
    }

}

export { validateProjectAccess}