/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solfund.json`.
 */
export type Solfund = {
  "address": "DqajaMsDVX9DiXt3Ld2p6C8QghNCRqkfcZBzkMF7PSQ7",
  "metadata": {
    "name": "solfund",
    "version": "1.0.0",
    "spec": "0.1.0",
    "description": "Crowd funding app for solana"
  },
  "docs": [
    "This is main entrypoint for the program"
  ],
  "instructions": [
    {
      "name": "claimCampaign",
      "docs": [
        "Claim a campaign"
      ],
      "discriminator": [
        118,
        195,
        170,
        16,
        78,
        8,
        26,
        38
      ],
      "accounts": [
        {
          "name": "campaign",
          "docs": [
            "The [Campaign]"
          ],
          "writable": true
        },
        {
          "name": "owner",
          "docs": [
            "Owner for the campaign"
          ],
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "newCampaign",
      "docs": [
        "Creates a new campaign"
      ],
      "discriminator": [
        43,
        98,
        26,
        97,
        90,
        97,
        109,
        37
      ],
      "accounts": [
        {
          "name": "campaign",
          "docs": [
            "[Campaign]"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "arg",
                "path": "title"
              }
            ]
          }
        },
        {
          "name": "owner",
          "docs": [
            "Owner for the campaign, also the payer for the fees"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "The [System] program."
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "goal",
          "type": "u64"
        },
        {
          "name": "endTs",
          "type": "i64"
        },
        {
          "name": "metadataUri",
          "type": "string"
        }
      ]
    },
    {
      "name": "newContribution",
      "docs": [
        "Creates a new contribution"
      ],
      "discriminator": [
        87,
        184,
        39,
        4,
        14,
        32,
        16,
        172
      ],
      "accounts": [
        {
          "name": "campaign",
          "docs": [
            "The [Campaign]"
          ],
          "writable": true
        },
        {
          "name": "contribution",
          "docs": [
            "The [Contribution]"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  111,
                  110,
                  116,
                  114,
                  105,
                  98,
                  117,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "contributor"
              },
              {
                "kind": "account",
                "path": "campaign"
              }
            ]
          }
        },
        {
          "name": "contributor",
          "docs": [
            "The contributor for the campaign, also the fee payer"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "The [System] program."
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "removeContribution",
      "docs": [
        "Remove a contribution"
      ],
      "discriminator": [
        229,
        193,
        118,
        68,
        227,
        144,
        247,
        50
      ],
      "accounts": [
        {
          "name": "campaign",
          "docs": [
            "The [Campaign]"
          ],
          "writable": true
        },
        {
          "name": "contribution",
          "docs": [
            "The [Contribution]"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  111,
                  110,
                  116,
                  114,
                  105,
                  98,
                  117,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "contributor"
              },
              {
                "kind": "account",
                "path": "campaign"
              }
            ]
          }
        },
        {
          "name": "contributor",
          "docs": [
            "The contributor for the campaign",
            "This is receiver of the closed account and must be the owner"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "The [System] program."
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "updateCampaignUri",
      "docs": [
        "Update a campaign URI"
      ],
      "discriminator": [
        140,
        132,
        170,
        212,
        192,
        145,
        92,
        155
      ],
      "accounts": [
        {
          "name": "campaign",
          "docs": [
            "The [Campaign]"
          ],
          "writable": true
        },
        {
          "name": "owner",
          "docs": [
            "Owner for the campaign"
          ],
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "metadataUri",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "campaign",
      "discriminator": [
        50,
        40,
        49,
        11,
        157,
        220,
        229,
        192
      ]
    },
    {
      "name": "contribution",
      "discriminator": [
        182,
        187,
        14,
        111,
        72,
        167,
        242,
        212
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "campaignTsNotBigEnough",
      "msg": "Campaign end timestamp must be in the future and have at least 24 hours"
    },
    {
      "code": 6001,
      "name": "campaignZeroGoal",
      "msg": "Campaign goal must be bigger than zero"
    },
    {
      "code": 6002,
      "name": "campaignUriEmpty",
      "msg": "Campaign Metadata URI must be provided"
    },
    {
      "code": 6003,
      "name": "campaignUriTooBig",
      "msg": "Campaign Metadata URI is too big"
    },
    {
      "code": 6004,
      "name": "campaignTitleEmpty",
      "msg": "Campaign title must be provided"
    },
    {
      "code": 6005,
      "name": "interactionWithClosedCampaign",
      "msg": "Can't interact with a expired campaign"
    },
    {
      "code": 6006,
      "name": "zeroContribution",
      "msg": "Contribution can't be zero"
    },
    {
      "code": 6007,
      "name": "unauthorized",
      "msg": "Account is not authorized to execute this instruction"
    },
    {
      "code": 6008,
      "name": "arithmeticError",
      "msg": "Arithmetic Error (overflow/underflow)"
    },
    {
      "code": 6009,
      "name": "claimOpenCampaign",
      "msg": "Can't claim on open campaign"
    },
    {
      "code": 6010,
      "name": "claimNotSuccessCampaign",
      "msg": "Can't claim on a not successful campaign"
    },
    {
      "code": 6011,
      "name": "claimWithWithdraw",
      "msg": "Can't claim on a already withdrawn campaign"
    }
  ],
  "types": [
    {
      "name": "campaign",
      "docs": [
        "Represents a funding campaign on the system"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "The bump seed for the account"
            ],
            "type": "u8"
          },
          {
            "name": "owner",
            "docs": [
              "The owner of the campaign"
            ],
            "type": "pubkey"
          },
          {
            "name": "goal",
            "docs": [
              "The goal of the campaign (in lamports)"
            ],
            "type": "u64"
          },
          {
            "name": "title",
            "docs": [
              "The title of the campaign"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "titleLength",
            "docs": [
              "The length of the title"
            ],
            "type": "u16"
          },
          {
            "name": "startTs",
            "docs": [
              "When the campaign has started (unix timestamp)"
            ],
            "type": "i64"
          },
          {
            "name": "endTs",
            "docs": [
              "When the campaign will end (unix timestamp)"
            ],
            "type": "i64"
          },
          {
            "name": "metadataUri",
            "docs": [
              "The metadata for the campaign as IPFS hash"
            ],
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "metadataUriLength",
            "docs": [
              "The final size of the metadata URI"
            ],
            "type": "u16"
          },
          {
            "name": "totalFunds",
            "docs": [
              "The total funds on the account"
            ],
            "type": "u64"
          },
          {
            "name": "isSuccessful",
            "docs": [
              "If the campaign has been successful"
            ],
            "type": "bool"
          },
          {
            "name": "isWithdrawn",
            "docs": [
              "If the owner has withdrawn the funds"
            ],
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "contribution",
      "docs": [
        "Represents a contribution"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "contributor",
            "docs": [
              "The owner of the contribution"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "The amount of the contribution"
            ],
            "type": "u64"
          }
        ]
      }
    }
  ]
};
