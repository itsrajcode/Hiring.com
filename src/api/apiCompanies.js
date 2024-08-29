import service from "@/appwrite/config";

// Fetch Companies
export async function getCompanies() {
  try {
    const response = await service.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return null;
  }
}

// Add Company
export async function addNewCompany(companyData) {
  try {
    const random = Math.floor(Math.random() * 90000);
    const fileName = `logo-${random}-${companyData.name}`;

    // Upload company logo to Appwrite storage
    const fileUploadResponse = await service.bucket.createFile(
      conf.appwriteBucketId,
      fileName,
      companyData.logo
    );

    const logoUrl = service.bucket.getFilePreview(fileUploadResponse.$id);

    // Insert new company document into Appwrite database
    const response = await service.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      fileName, // Using fileName as the document ID
      {
        name: companyData.name,
        logo_url: logoUrl,
      }
    );

    return response;
  } catch (error) {
    console.error("Error adding new company:", error);
    throw new Error("Error submitting company");
  }
}
