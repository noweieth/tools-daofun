export type DaoFun ={
    "address": "5jnapfrAN47UYkLkEf7HnprPPBCQLvkYWGZDeKkaP5hv",
    "metadata": {
      "name": "virtual_xyk",
      "version": "3.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "add_liquidity",
        "discriminator": [181, 157, 89, 67, 143, 182, 52, 72],
        "accounts": [
          { "name": "signer", "writable": true, "signer": true },
          { "name": "depositor" },
          { "name": "lp_mint", "writable": true },
          { "name": "token_mint" },
          { "name": "funding_mint" },
          {
            "name": "curve",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "const", "value": [99, 117, 114, 118, 101] },
                { "kind": "account", "path": "depositor" }
              ]
            }
          },
          {
            "name": "signer_lp_ata",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "signer" },
                { "kind": "account", "path": "lp_token_program" },
                { "kind": "account", "path": "lp_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "signer_token_ata",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "signer" },
                { "kind": "account", "path": "token_program" },
                {
                  "kind": "account",
                  "path": "curve.token_mint",
                  "account": "Curve"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "signer_funding_ata",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "signer" },
                { "kind": "account", "path": "funding_token_program" },
                {
                  "kind": "account",
                  "path": "curve.funding_mint",
                  "account": "Curve"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "token_vault",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "curve" },
                { "kind": "account", "path": "token_program" },
                {
                  "kind": "account",
                  "path": "curve.token_mint",
                  "account": "Curve"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "funding_vault",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "curve" },
                { "kind": "account", "path": "funding_token_program" },
                {
                  "kind": "account",
                  "path": "curve.funding_mint",
                  "account": "Curve"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "lp_token_program",
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          },
          { "name": "token_program" },
          { "name": "funding_token_program" },
          {
            "name": "associated_token_program",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          { "name": "token_amount", "type": "u64" },
          { "name": "max_funding_amount", "type": "u64" }
        ]
      },
      {
        "name": "buy_token",
        "discriminator": [138, 127, 14, 91, 38, 87, 115, 105],
        "accounts": [
          { "name": "signer", "writable": true, "signer": true },
          { "name": "depositor" },
          { "name": "token_mint" },
          { "name": "funding_mint" },
          {
            "name": "curve",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "const", "value": [99, 117, 114, 118, 101] },
                { "kind": "account", "path": "depositor" }
              ]
            }
          },
          {
            "name": "signer_token_ata",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "signer" },
                { "kind": "account", "path": "token_program" },
                { "kind": "account", "path": "token_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "signer_funding_ata",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "signer" },
                { "kind": "account", "path": "funding_token_program" },
                { "kind": "account", "path": "funding_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "token_vault",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "curve" },
                { "kind": "account", "path": "token_program" },
                { "kind": "account", "path": "token_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "funding_vault",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "curve" },
                { "kind": "account", "path": "funding_token_program" },
                { "kind": "account", "path": "funding_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          { "name": "token_program" },
          { "name": "funding_token_program" },
          {
            "name": "associated_token_program",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          { "name": "funding_amount", "type": "u64" },
          { "name": "min_token_amount", "type": "u64" }
        ]
      },
      {
        "name": "init_lp",
        "discriminator": [90, 134, 130, 76, 50, 225, 21, 142],
        "accounts": [
          { "name": "payer", "writable": true, "signer": true },
          { "name": "depositor" },
          {
            "name": "curve",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "const", "value": [99, 117, 114, 118, 101] },
                { "kind": "account", "path": "depositor" }
              ]
            }
          },
          { "name": "lp_mint", "writable": true, "signer": true },
          {
            "name": "lp_vault",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "curve" },
                { "kind": "account", "path": "token_program" },
                { "kind": "account", "path": "lp_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "token_program",
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          },
          {
            "name": "associated_token_program",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          { "name": "name", "type": "string" },
          { "name": "symbol", "type": "string" },
          { "name": "uri", "type": "string" }
        ]
      },
      {
        "name": "initialize",
        "discriminator": [175, 175, 109, 31, 13, 152, 155, 237],
        "accounts": [
          { "name": "depositor", "writable": true, "signer": true },
          { "name": "payer", "writable": true, "signer": true },
          { "name": "fee_authority" },
          { "name": "token_mint" },
          { "name": "funding_mint" },
          {
            "name": "curve",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "const", "value": [99, 117, 114, 118, 101] },
                { "kind": "account", "path": "depositor" }
              ]
            }
          },
          {
            "name": "depositor_token_ata",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "depositor" },
                { "kind": "account", "path": "token_program" },
                { "kind": "account", "path": "token_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "token_vault",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "curve" },
                { "kind": "account", "path": "token_program" },
                { "kind": "account", "path": "token_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "depositor_funding_ata",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "depositor" },
                { "kind": "account", "path": "funding_token_program" },
                { "kind": "account", "path": "funding_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "funding_vault",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "curve" },
                { "kind": "account", "path": "funding_token_program" },
                { "kind": "account", "path": "funding_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          },
          { "name": "token_program" },
          { "name": "funding_token_program" },
          {
            "name": "associated_token_program",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          { "name": "virtual_funding_amount", "type": "u64" },
          { "name": "deposit", "type": "u64" }
        ]
      },
      {
        "name": "migrate_v3",
        "discriminator": [245, 170, 103, 124, 144, 187, 21, 102],
        "accounts": [
          { "name": "signer", "writable": true, "signer": true },
          { "name": "depositor" },
          {
            "name": "curve",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "const", "value": [99, 117, 114, 118, 101] },
                { "kind": "account", "path": "depositor" }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": []
      },
      {
        "name": "redeem_fees",
        "discriminator": [215, 39, 180, 41, 173, 46, 248, 220],
        "accounts": [
          { "name": "signer", "writable": true, "signer": true },
          { "name": "depositor" },
          { "name": "funding_mint" },
          {
            "name": "curve",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "const", "value": [99, 117, 114, 118, 101] },
                { "kind": "account", "path": "depositor" }
              ]
            }
          },
          {
            "name": "signer_funding_ata",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "signer" },
                { "kind": "account", "path": "funding_token_program" },
                { "kind": "account", "path": "funding_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "funding_vault",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "curve" },
                { "kind": "account", "path": "funding_token_program" },
                { "kind": "account", "path": "funding_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "associated_token_program",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          },
          { "name": "funding_token_program" }
        ],
        "args": [{ "name": "amount", "type": "u64" }]
      },
      {
        "name": "remove_liquidity",
        "discriminator": [80, 85, 209, 72, 24, 206, 177, 108],
        "accounts": [
          { "name": "signer", "writable": true, "signer": true },
          { "name": "depositor" },
          { "name": "lp_mint", "writable": true },
          { "name": "token_mint" },
          { "name": "funding_mint" },
          {
            "name": "curve",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "const", "value": [99, 117, 114, 118, 101] },
                { "kind": "account", "path": "depositor" }
              ]
            }
          },
          {
            "name": "signer_lp_ata",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "signer" },
                { "kind": "account", "path": "lp_token_program" },
                { "kind": "account", "path": "lp_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "signer_token_ata",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "signer" },
                { "kind": "account", "path": "token_program" },
                {
                  "kind": "account",
                  "path": "curve.token_mint",
                  "account": "Curve"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "signer_funding_ata",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "signer" },
                { "kind": "account", "path": "funding_token_program" },
                {
                  "kind": "account",
                  "path": "curve.funding_mint",
                  "account": "Curve"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "token_vault",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "curve" },
                { "kind": "account", "path": "token_program" },
                {
                  "kind": "account",
                  "path": "curve.token_mint",
                  "account": "Curve"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "funding_vault",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "curve" },
                { "kind": "account", "path": "funding_token_program" },
                {
                  "kind": "account",
                  "path": "curve.funding_mint",
                  "account": "Curve"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "lp_token_program",
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          },
          { "name": "token_program" },
          { "name": "funding_token_program" },
          {
            "name": "associated_token_program",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          { "name": "lp_amount", "type": "u64" },
          { "name": "min_token_amount", "type": "u64" },
          { "name": "min_funding_amount", "type": "u64" }
        ]
      },
      {
        "name": "sell_token",
        "discriminator": [109, 61, 40, 187, 230, 176, 135, 174],
        "accounts": [
          { "name": "signer", "writable": true, "signer": true },
          { "name": "depositor" },
          { "name": "token_mint" },
          { "name": "funding_mint" },
          {
            "name": "curve",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "const", "value": [99, 117, 114, 118, 101] },
                { "kind": "account", "path": "depositor" }
              ]
            }
          },
          {
            "name": "signer_token_ata",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "signer" },
                { "kind": "account", "path": "token_program" },
                { "kind": "account", "path": "token_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "signer_funding_ata",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "signer" },
                { "kind": "account", "path": "funding_token_program" },
                { "kind": "account", "path": "funding_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "token_vault",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "curve" },
                { "kind": "account", "path": "token_program" },
                { "kind": "account", "path": "token_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          {
            "name": "funding_vault",
            "writable": true,
            "pda": {
              "seeds": [
                { "kind": "account", "path": "curve" },
                { "kind": "account", "path": "funding_token_program" },
                { "kind": "account", "path": "funding_mint" }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                  13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                  219, 233, 248, 89
                ]
              }
            }
          },
          { "name": "token_program" },
          { "name": "funding_token_program" },
          {
            "name": "associated_token_program",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          { "name": "amount", "type": "u64" },
          { "name": "min_funding_amount", "type": "u64" }
        ]
      }
    ],
    "accounts": [
      { "name": "Curve", "discriminator": [191, 180, 249, 66, 180, 71, 51, 182] }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "InvalidFeeAuthority",
        "msg": "Unauthorized fee withdrawal"
      },
      {
        "code": 6001,
        "name": "InvalidFeeAmount",
        "msg": "The fee amount is invalid"
      },
      { "code": 6002, "name": "SlippageExceeded", "msg": "Slippage exceeded" },
      { "code": 6003, "name": "ZeroLpToMint", "msg": "Invalid LP to Mint" },
      { "code": 6004, "name": "Unauthorized", "msg": "Unauthorized" }
    ],
    "types": [
      {
        "name": "Curve",
        "type": {
          "kind": "struct",
          "fields": [
            { "name": "token_amount", "type": "u64" },
            { "name": "funding_amount", "type": "u64" },
            { "name": "virtual_funding_amount", "type": "u64" },
            { "name": "token_mint", "type": "pubkey" },
            { "name": "funding_mint", "type": "pubkey" },
            { "name": "total_fee_amount", "type": "u64" },
            { "name": "total_fee_distributed", "type": "u64" },
            { "name": "fee_authority", "type": "pubkey" },
            { "name": "lp_mint", "type": { "option": "pubkey" } }
          ]
        }
      }
    ]
  }
  