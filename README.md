# Simple Wallet Api

This is a simple wallet graphql api application which has the following does the following

- Registion and login
- Account deposit
- Account withdrawal
- Balance enquiry
- Account statements

### **Installation**

To build the docker image with docker with docker compose run the following command :

```bash
docker-compose -f docker-compose.yml build
```

Then run the application with the command below :

```bash
docker-compose -f docker-compose.yml up
```

The above command create the postgres container then runs db migrations then creates simplewallet container, which is our application and exposes it on port 4000.

You can access the graphql plaground from [http://localhost:4000/](http://localhost:4000/)

### **Usage**

**Signup**

```graphql
mutation {
  signup(email: "", password:"", username:"") {
    email,
    username,
    id,
    active
  }
}
```

**Login**

```graphql
mutation {
  login(email: "", password: ""){
    token,
    user{
      id,
      username,
      email,
      active
    }
  }
}
```

The  account queries and mutations require a **jsonwebtoken** (JWT) for authorization which is added in the request headers  under **http headers** section of the graphql playground

```json
{
  "Authorization": "Bearer  <token>"
}
```

**Balance**

```graphql
{
  balance{
    available_balance
  }
}
```

**Deposit**

```graphql
mutation {
  deposit(amount: 1000){
    id,
    amount,
    new_balance,
    prev_balance,
    status,
    type,
    updatedAt
  }
}
```

**Withdrawal**

```graphql
mutation {
  withdrawal(amount: 100){
    id,
    amount,
    new_balance,
    prev_balance,
    status,
    status,
    type,
    updatedAt
  }
}
```

**Statements**

```graphql
{
  statements{
    id,
    amount,
    new_balance,
    prev_balance,
    status,
    type,
    updatedAt
  }
}
```