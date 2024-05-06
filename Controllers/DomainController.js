import AWS from "aws-sdk";
import Route53 from "aws-sdk/clients/route53.js";
import dotenv from "dotenv/config";

AWS.config.update({
  accessKeyId: process.env.AccessID,
  secretAccessKey: process.env.AccessKey,
  region: process.env.region,
});

const route53 = new Route53();

export const listDomains = async (req, res) => {
  try {
    const result = await route53.listHostedZones().promise();
    return res.status(200).json({ hostedZones: result.HostedZones });
  } catch (error) {
    console.error("Error listing hosted zones:", error);
    return res.status(500).json({ error: "Error listing hosted zones" });
  }
};

export const createHostedZone = async (req, res) => {
  try {
    const { domainName, description } = req.body;
    if (!domainName) {
      return res.status(400).json({ error: "Domain name is required" });
    }

    const params = {
      CallerReference: `${Date.now()}`,
      Name: domainName,
      HostedZoneConfig: {
        Comment: description,
      },
    };

    const result = await route53.createHostedZone(params).promise();
    return res.status(201).json({ hostedZoneId: result.HostedZone.Id });
  } catch (error) {
    console.error("Error creating hosted zone:", error);
    return res.status(500).json({ error: "Error creating hosted zone" });
  }
};

export const deleteHostedZone = async (req, res) => {
  try {
    const { hostedZoneId } = req.params;
    const params = {
      Id: hostedZoneId,
    };
    await route53.deleteHostedZone(params).promise();
    console.log("Hosted zone deleted:", hostedZoneId);
    return res
      .status(200)
      .json({ message: "Successfully deleted the hosted zone" });
  } catch (error) {
    console.error("Error deleting hosted zone:", error);
    return res.status(500).json({ error: "Error deleting hosted zone" });
  }
};
