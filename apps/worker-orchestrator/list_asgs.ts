import { AutoScalingClient, DescribeAutoScalingGroupsCommand } from "@aws-sdk/client-auto-scaling";

const client = new AutoScalingClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_ACCESS_SECRET!,
    }
});

const command = new DescribeAutoScalingGroupsCommand({});

try {
    const response = await client.send(command);
    console.log("Found Auto Scaling Groups:");
    if (response.AutoScalingGroups && response.AutoScalingGroups.length > 0) {
        response.AutoScalingGroups.forEach(asg => {
            console.log(`- Name: ${asg.AutoScalingGroupName}, Status: ${asg.Status}`);
        });
    } else {
        console.log("No Auto Scaling Groups found in this region.");
    }
} catch (error) {
    console.error("Error listing ASGs:", error);
}
