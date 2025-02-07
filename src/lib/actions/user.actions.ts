'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";

async function getUserByEmail(email: string) {
  const { databases } = await createAdminClient()

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal('email', [email])]
  )

  return result.total > 0 ? result.documents[0] : null
}

function handleError(error: unknown, message: string) {
  console.log(error, message)
  throw error
}

async function sendEmailOTP({ email }: { email: string }) {
  const { account } = await createAdminClient()

  try {
    const session = await account.createEmailToken(ID.unique(), email)

    return session.userId
  } catch (error) {
    handleError(error, 'Failed to send email OTP')
  }
}

export const createAccount = async ({ fullName, email }: { fullName: string; email: string }) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email })

  if (!accountId) throw new Error('Failed to send an OTP')

  if (!existingUser) {
    const { databases } = await createAdminClient()

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: 'https://media.gettyimages.com/id/1997233757/pt/foto/user-icon-in-flat-style-group-of-erson-icon-user-icon-for-web-site-user-icon-vector.jpg?s=1024x1024&w=gi&k=20&c=KlcXCX4jlCkpxXm7nAUShzLgMLnsi-11mXiazgjklpk=',
        accountId
      }
    )
  }
  return parseStringify({ accountId })
}