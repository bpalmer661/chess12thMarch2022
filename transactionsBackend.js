




           exports.getTransactions = (req, res) => {
      
              db.collection("users").doc(`${req.params.email}`).collection(`transactions`).get()
              .then(data => {
                let transactions = [];
                data.forEach(doc => {
        
                
                    transactions.push({
                        ...doc.data()
                    });
                });
            return res.json(transactions);
            })
            .catch(err => console.error(err));
            }
        
