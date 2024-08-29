import { Client, Databases, Storage, Query, ID } from "appwrite";
import conf from "@/conf/conf";

// Initialize Appwrite client
const client = new Client();
client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);

const databases = new Databases(client);
const storage = new Storage(client);

// Fetch Jobs
export async function getJobs(token, { location, company_id, searchQuery }) {
  let queries = [];

  if (location) {
    queries.push(Query.equal("location", location));
  }

  if (company_id) {
    queries.push(Query.equal("company_id", company_id));
  }

  if (searchQuery) {
    queries.push(Query.search("title", searchQuery));
  }

  try {
    const response = await databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      queries
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }
}

// Read Saved Jobs
export async function getSavedJobs(token) {
  try {
    const response = await databases.listDocuments(
      conf.appwriteDatabaseId,
      "saved_jobs"
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }
}

// Read single job
export async function getSingleJob(token, { job_id }) {
  try {
    const response = await databases.getDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      job_id
    );
    return response;
  } catch (error) {
    console.error("Error fetching Job:", error);
    return null;
  }
}

// Add / Remove Saved Job
export async function saveJob(token, { alreadySaved }, saveData) {
  if (alreadySaved) {
    // If the job is already saved, remove it
    try {
      const response = await databases.deleteDocument(
        conf.appwriteDatabaseId,
        "saved_jobs",
        saveData.job_id
      );
      return response;
    } catch (error) {
      console.error("Error removing saved job:", error);
      return null;
    }
  } else {
    // If the job is not saved, add it to saved jobs
    try {
      const response = await databases.createDocument(
        conf.appwriteDatabaseId,
        "saved_jobs",
        ID.unique(),
        saveData
      );
      return response;
    } catch (error) {
      console.error("Error saving job:", error);
      return null;
    }
  }
}

// Job isOpen toggle - (recruiter_id = auth.uid())
export async function updateHiringStatus(token, { job_id }, isOpen) {
  try {
    const response = await databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      job_id,
      { isOpen }
    );
    return response;
  } catch (error) {
    console.error("Error Updating Hiring Status:", error);
    return null;
  }
}

// Get my created jobs
export async function getMyJobs(token, { recruiter_id }) {
  try {
    const response = await databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      [Query.equal("recruiter_id", recruiter_id)]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }
}

// Delete job
export async function deleteJob(token, { job_id }) {
  try {
    const response = await databases.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      job_id
    );
    return response;
  } catch (error) {
    console.error("Error deleting job:", error);
    return null;
  }
}

// Post job
export async function addNewJob(token, _, jobData) {
  try {
    const response = await databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      ID.unique(),
      jobData
    );
    return response;
  } catch (error) {
    console.error("Error Creating Job:", error);
    throw new Error("Error Creating Job");
  }
}
