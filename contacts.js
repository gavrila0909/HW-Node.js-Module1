const fs = require("fs").promises;
const path = require("path");
const colors = require("colors");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(data);
    // console.table(contacts);
    return contacts;
  } catch (error) {
    console.error("Error reading contacts:", error.message);
    throw error;
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contactById = contacts.find((contact) => contact.id === contactId);
    if (!contactById) {
      console.log(`Contact with id '${contactId}' not found.`.red);
    }
    console.log(`Contact with ID '${contactById.id}':`.blue);
    console.table([contactById]);
    return contactById;
  } catch (error) {
    console.error(`Error getting contact by ID: ${error.message}`);
    throw error;
  }
}

async function removeContact(contactId) {
  try {
    let contacts = await listContacts();
    contacts = contacts.filter((contact) => contact.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
    console.log(
      `Contact with id '${contactId}' has been removed successfully.`.green
    );
  } catch (error) {
    console.error(`Contact could not be removed: ${error.message}`);
    throw error;
  }
}

async function addContact(name, email, phone) {
  try {
    let contacts = await listContacts();
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
    console.log("New contact has been added successfully!".green);
    return newContact;
  } catch (error) {
    console.error(`Error adding contact: ${error.message}`);
    throw error;
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
