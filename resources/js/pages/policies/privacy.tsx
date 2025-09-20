// pages/policies/privacy.tsx

// Necessary imports
import { useMemo } from "react";
import { Head } from "@inertiajs/react";

// Layout
import { PoliciesLayout } from "@/layouts/policies";

// Shadcn UI Components
import { Separator } from "@/components/ui/separator";

export default function Privacy() {
	const updatedAt = useMemo(() => "2025-09-20", []);
	const appName = "VPS Manager";
	const operator = "Instance Operator";

	return (
		<PoliciesLayout>
			<Head title="Privacy Policy" />

			<h1 className="text-2xl font-semibold">Privacy Policy</h1>
			<p>Last updated: {updatedAt}</p>

			<Separator />

			<p>
				This Privacy Policy explains how data is handled when using an Instance of{" "}
				{appName}. The Authors do not collect or process your data. Each Instance is
				operated independently by its {operator}.
			</p>

			<Separator />

			<h2 id="roles" className="text-xl font-semibold mt-2">
				Roles and responsibilities
			</h2>
			<p>
				The {operator} acts as the data controller for their Instance. The Authors
				publish the Software but do not host or access your data and are not data
				controllers or processors for third-party Instances.
			</p>

			<Separator />

			<h2 id="data" className="text-xl font-semibold mt-2">
				Data processed
			</h2>
			<ul className="list-disc pl-6 space-y-2">
				<li>Authentication data tied to local system accounts.</li>
				<li>
					Technical and operational logs (system events, error messages, security
					events).
				</li>
				<li>Configuration data provided by the {operator} or Users.</li>
				<li>Any other content voluntarily processed within the Instance.</li>
			</ul>

			<Separator />

			<h2 id="purposes" className="text-xl font-semibold mt-2">
				Purposes of processing
			</h2>
			<p>
				Data may be used to ensure authentication, security, troubleshooting,
				operational monitoring and management of the Instance. The Authors do not
				perform profiling, analytics or marketing.
			</p>

			<Separator />

			<h2 id="legal-basis" className="text-xl font-semibold mt-2">
				Legal basis
			</h2>
			<p>
				The legal basis for processing depends on the {operator}'s implementation
				and applicable law. The Authors make no representation regarding compliance
				of third-party Instances.
			</p>

			<Separator />

			<h2 id="cookies" className="text-xl font-semibold mt-2">
				Cookies and local storage
			</h2>
			<p>
				Instances may use cookies or local storage strictly necessary for
				authentication, security and user preferences. Any additional cookies or
				third-party services are configured solely by the {operator}.
			</p>

			<Separator />

			<h2 id="sharing" className="text-xl font-semibold mt-2">
				Sharing and transfers
			</h2>
			<p>
				No data is sent to the Authors. Data may be shared with third parties only
				if configured by the {operator}.
			</p>

			<Separator />

			<h2 id="retention" className="text-xl font-semibold mt-2">
				Retention
			</h2>
			<p>
				Data retention and backup policies are defined by the {operator}. Logs and
				sensitive data should be minimized and rotated regularly.
			</p>

			<Separator />

			<h2 id="security" className="text-xl font-semibold mt-2">
				Security
			</h2>
			<p>
				The Software aims for secure defaults but cannot guarantee absolute
				security. The {operator} is responsible for implementing appropriate
				safeguards. Vulnerabilities should be reported as described in the Security
				Policy.
			</p>

			<Separator />

			<h2 id="rights" className="text-xl font-semibold mt-2">
				Data subject rights
			</h2>
			<p>
				Requests to access, correct or delete data must be directed to the{" "}
				{operator} of the Instance. The Authors cannot handle such requests.
			</p>

			<Separator />

			<h2 id="changes" className="text-xl font-semibold mt-2">
				Changes
			</h2>
			<p>
				This Privacy Policy may be updated. Continued use of the Software or an
				Instance after updates constitutes acceptance of the revised terms.
			</p>

			<Separator />

			<h2 id="law" className="text-xl font-semibold mt-2">
				Governing law
			</h2>
			<p>
				This Privacy Policy is governed by the laws of France. Any dispute shall be
				brought before the competent courts in France.
			</p>
		</PoliciesLayout>
	);
}
