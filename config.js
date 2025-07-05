// Configuration for your app
const config = {
  appName: "Task & Earn",
  currencyName: "coins",
  tasks: [
    {
      id: 1,
      title: "Watch a short video",
      description: "Watch a 30-second video ad to earn coins",
      reward: 50,
      type: "daily",
      maxCompletions: 1,
      currentCompletions: 0
    },
    {
      id: 2,
      title: "Complete a survey",
      description: "Answer 10 questions about your preferences",
      reward: 120,
      type: "survey",
      maxCompletions: 10,
      currentCompletions: 0
    },
    {
      id: 3,
      title: "Install App",
      description: "Install and open our partner app to earn big rewards",
      reward: 500,
      type: "offer",
      maxCompletions: 1,
      currentCompletions: 0
    }
  ],
  rewards: [
    {
      id: 1,
      title: "$5 Gift Card",
      description: "Redeem your coins for a $5 gift card",
      cost: 1000,
      stock: 10
    },
    {
      id: 2,
      title: "Premium Subscription",
      description: "1 month of premium features",
      cost: 1500,
      stock: 5
    }
  ]
};
