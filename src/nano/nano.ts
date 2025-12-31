import connect, { type MaybeDocument, type DocumentInsertResponse } from "nano";

export const BASE_URL = 'http://localhost:5984';
export const ADMIN_AUTH = { username: 'admin', password: 'password' };

class Person implements MaybeDocument {
  _id?: string;
  _rev?: string;

  constructor(private readonly name: string, public readonly alias: string) {}

  processAPIResponse(response: DocumentInsertResponse) {
    if (response.ok === true) {
      this._id = response.id;
      this._rev = response.rev;
    }
  }
}

async function main() {
  console.log("Connecting to the database...");
  const nano = connect({ url: BASE_URL });
  await nano.auth(ADMIN_AUTH.username, ADMIN_AUTH.password);

  console.log("\nListing all databases...");
  const databases = await nano.db.list();
  console.log(databases);

  console.log("\nCreating and connecting to the database...");
  await nano.db.create("nano");
  const nanoDb = await nano.db.use("nano");

  const person = new Person("Robert", "Uncle Bob");
  const response = await nanoDb.insert(person);
  console.log("Response from nano db insert:", response);
  person.processAPIResponse(response);
  console.log("Processed person after insert:", person);

  const morePeople = [
    new Person("Brian", "Uncle Brian"),
    new Person("Alice", "Mum Alice"),
    new Person("Charlie", "Dad Charlie"),
    new Person("David", "Uncle David"),
    new Person("Eve", "Aunt Eve"),
    new Person("Frank", "Uncle Frank"),
  ];

  for (const person of morePeople) {
    const response = await nanoDb.insert(person);
    person.processAPIResponse(response);
  }

  const q = {
    selector: {
      $or: [
        {
          name: { $eq: "Eve"},
        },
        {
          alias: { $regex: "Uncle"},
        },
      ],
    },
    fields: [ "name", "alias" ],
    limit:50
  };
  const result = await nanoDb.find(q)
  console.log("Result of the find query:", result);
}

main();
