import Complaint from "../models/Complaint.js";


export async function fileComplaint(req,res) {
    
    const { userId, category, subcategory, description } = req.body;
    
    try {
        const complaint = new Complaint({
        userId,
        category,
        subcategory,
        description,
        });
        await complaint.save();
        res.status(201).json({ message: 'Complaint filed successfully', complaint });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
      
} 
export async function trackComplaint(req,res) {
    
        const { userId } = req.params;
      
        try {
          const complaints = await Complaint.find({ userId }).populate('assignedTo', 'name');
          res.status(200).json({ complaints });
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      
      
} 
export async function resolveComplaint(req,res) {
   
        const { complaintId } = req.params;
        const { resolutionDetails } = req.body;
      
        try {
          const complaint = await Complaint.findById(complaintId);
          if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
          }
      
          complaint.status = 'Resolved';
          complaint.resolutionDetails = resolutionDetails;
          await complaint.save();
      
          res.status(200).json({ message: 'Complaint resolved successfully', complaint });
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
         
} 