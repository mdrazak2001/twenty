import { PrismaClient } from '@prisma/client';
export const seedPeople = async (prisma: PrismaClient) => {
  await prisma.person.upsert({
    where: { id: 'twenty-86083141-1c0e-494c-a1b6-85b1c6fefaa5' },
    update: {},
    create: {
      id: 'twenty-86083141-1c0e-494c-a1b6-85b1c6fefaa5',
      firstName: 'Christoph',
      lastName: 'Callisto',
      workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
      phone: '+33789012345',
      city: 'Seattle',
      companyId: 'twenty-fe256b39-3ec3-4fe3-8997-b76aa0bfa408',
      email: 'christoph.calisto@linkedin.com',
    },
  });

  await prisma.person.upsert({
    where: { id: 'twenty-0aa00beb-ac73-4797-824e-87a1f5aea9e0' },
    update: {},
    create: {
      id: 'twenty-0aa00beb-ac73-4797-824e-87a1f5aea9e0',
      firstName: 'Sylvie',
      lastName: 'Palmer',
      workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
      phone: '+33780123456',
      city: 'Los Angeles',
      companyId: 'twenty-fe256b39-3ec3-4fe3-8997-b76aa0bfa408',
      email: 'sylvie.palmer@linkedin.com',
    },
  });

  await prisma.person.upsert({
    where: { id: 'twenty-93c72d2e-f517-42fd-80ae-14173b3b70ae' },
    update: {},
    create: {
      id: 'twenty-93c72d2e-f517-42fd-80ae-14173b3b70ae',
      firstName: 'Christopher',
      lastName: 'Gonzalez',
      workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
      phone: '+33789012345',
      city: 'Seattle',
      companyId: 'twenty-04b2e9f5-0713-40a5-8216-82802401d33e',
      email: 'christopher.gonzalez@qonto.com',
    },
  });

  await prisma.person.upsert({
    where: { id: 'twenty-eeeacacf-eee1-4690-ad2c-8619e5b56a2e' },
    update: {},
    create: {
      id: 'twenty-eeeacacf-eee1-4690-ad2c-8619e5b56a2e',
      firstName: 'Ashley',
      lastName: 'Parker',
      workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
      phone: '+33780123456',
      city: 'Los Angeles',
      companyId: 'twenty-04b2e9f5-0713-40a5-8216-82802401d33e',
      email: 'ashley.parker@qonto.com',
    },
  });

  await prisma.person.upsert({
    where: { id: 'twenty-9b324a88-6784-4449-afdf-dc62cb8702f2' },
    update: {},
    create: {
      id: 'twenty-9b324a88-6784-4449-afdf-dc62cb8702f2',
      firstName: 'Nicholas',
      lastName: 'Wright',
      workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
      phone: '+33781234567',
      city: 'Seattle',
      companyId: 'twenty-460b6fb1-ed89-413a-b31a-962986e67bb4',
      email: 'nicholas.wright@microsoft.com',
    },
  });

  await prisma.person.upsert({
    where: { id: 'twenty-1d151852-490f-4466-8391-733cfd66a0c8' },
    update: {},
    create: {
      id: 'twenty-1d151852-490f-4466-8391-733cfd66a0c8',
      firstName: 'Isabella',
      lastName: 'Scott',
      workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
      phone: '+33782345678',
      city: 'New York',
      companyId: 'twenty-460b6fb1-ed89-413a-b31a-962986e67bb4',
      email: 'isabella.scott@microsoft.com',
    },
  });

  await prisma.person.upsert({
    where: { id: 'twenty-98406e26-80f1-4dff-b570-a74942528de3' },
    update: {},
    create: {
      id: 'twenty-98406e26-80f1-4dff-b570-a74942528de3',
      firstName: 'Matthew',
      lastName: 'Green',
      workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
      phone: '+33783456789',
      city: 'Seattle',
      companyId: 'twenty-460b6fb1-ed89-413a-b31a-962986e67bb4',
      email: 'matthew.green@microsoft.com',
    },
  });

  await prisma.person.upsert({
    where: { id: 'twenty-a2e78a5f-338b-46df-8811-fa08c7d19d35' },
    update: {},
    create: {
      id: 'twenty-a2e78a5f-338b-46df-8811-fa08c7d19d35',
      firstName: 'Elizabeth',
      lastName: 'Baker',
      workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
      phone: '+33784567890',
      city: 'New York',
      companyId: 'twenty-89bb825c-171e-4bcc-9cf7-43448d6fb278',
      email: 'elizabeth.baker@airbnb.com',
    },
  });

  await prisma.person.upsert({
    where: { id: 'twenty-ca1f5bf3-64ad-4b0e-bbfd-e9fd795b7016' },
    update: {},
    create: {
      id: 'twenty-ca1f5bf3-64ad-4b0e-bbfd-e9fd795b7016',
      firstName: 'Christopher',
      lastName: 'Nelson',
      workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
      phone: '+33785678901',
      city: 'San Francisco',
      companyId: 'twenty-89bb825c-171e-4bcc-9cf7-43448d6fb278',
      email: 'christopher.nelson@airbnb.com',
    },
  });

  await prisma.person.upsert({
    where: { id: 'twenty-56955422-5d54-41b7-ba36-f0d20e1417ae' },
    update: {},
    create: {
      id: 'twenty-56955422-5d54-41b7-ba36-f0d20e1417ae',
      firstName: 'Avery',
      lastName: 'Carter',
      workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
      phone: '+33786789012',
      city: 'New York',
      companyId: 'twenty-89bb825c-171e-4bcc-9cf7-43448d6fb278',
      email: 'avery.carter@airbnb.com',
    },
  });

  await prisma.person.upsert({
    where: { id: 'twenty-755035db-623d-41fe-92e7-dd45b7c568e1' },
    update: {},
    create: {
      id: 'twenty-755035db-623d-41fe-92e7-dd45b7c568e1',
      firstName: 'Ethan',
      lastName: 'Mitchell',
      workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
      phone: '+33787890123',
      city: 'Los Angeles',
      companyId: 'twenty-0d940997-c21e-4ec2-873b-de4264d89025',
      email: 'ethan.mitchell@google.com',
    },
  });

  await prisma.person.upsert({
    where: { id: 'twenty-240da2ec-2d40-4e49-8df4-9c6a049190ef' },
    update: {},
    create: {
      id: 'twenty-240da2ec-2d40-4e49-8df4-9c6a049190ef',
      firstName: 'Madison',
      lastName: 'Perez',
      workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
      phone: '+33788901234',
      city: 'Seattle',
      companyId: 'twenty-0d940997-c21e-4ec2-873b-de4264d89025',
      email: 'madison.perez@google.com',
    },
  });

  await prisma.person.upsert({
    where: { id: 'twenty-240da2ec-2d40-4e49-8df4-9c6a049190df' },
    update: {},
    create: {
      id: 'twenty-240da2ec-2d40-4e49-8df4-9c6a049190df',
      firstName: 'Bertrand',
      lastName: 'Voulzy',
      workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
      phone: '+33788901234',
      city: 'Seattle',
      companyId: 'twenty-0d940997-c21e-4ec2-873b-de4264d89025',
      email: 'bertrand.voulzy@google.com',
    },
  });

  await prisma.person.upsert({
    where: { id: 'twenty-240da2ec-2d40-4e49-8df4-9c6a049190dg' },
    update: {},
    create: {
      id: 'twenty-240da2ec-2d40-4e49-8df4-9c6a049190dg',
      firstName: 'Louis',
      lastName: 'Duss',
      workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
      phone: '+33788901234',
      city: 'Seattle',
      companyId: 'twenty-0d940997-c21e-4ec2-873b-de4264d89025',
      email: 'louis.duss@google.com',
    },
  });

  await prisma.person.upsert({
    where: { id: 'twenty-dev-240da2ec-2d40-4e49-8df4-9c6a049190dh' },
    update: {},
    create: {
      id: 'twenty-dev-240da2ec-2d40-4e49-8df4-9c6a049190dh',
      firstName: 'Lorie',
      lastName: 'Vladim',
      workspaceId: 'twenty-dev-7ed9d212-1c25-4d02-bf25-6aeccf7ea420',
      phone: '+33788901235',
      city: 'Seattle',
      companyId: 'twenty-dev-a674fa6c-1455-4c57-afaf-dd5dc086361e',
      email: 'lorie.vladim@google.com',
    },
  });
};
