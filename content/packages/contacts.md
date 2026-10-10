---
title: Contacts
description: Let users share a contact, or read and edit the address book.
package: Core/Contacts
section: packages
group: Data and contacts
icon: person.2
order: 147
---

# Contacts

The default is the system contact picker, which needs no permission and only returns the contact the user chooses. For features that need more, it can list, search, add, update and remove contacts and groups after asking permission, with text you set.

**When to use it.** Use pick when the user needs to choose one or a few people for a feature such as an invite. Only use the list, add and remove actions when the feature really needs the address book, because App Review rejects apps that ask for more than they use.

<PackageSample/>

<PackageReference/>
